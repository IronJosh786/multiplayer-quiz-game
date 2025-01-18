import { GoogleGenerativeAI } from '@google/generative-ai';

interface Env {
	GEMINI_API_KEY: string;
}

export default {
	async fetch(request, env: Env, ctx): Promise<Response> {
		const apiKey = env.GEMINI_API_KEY;
		const genAI = new GoogleGenerativeAI(apiKey);

		const model = genAI.getGenerativeModel({
			model: 'gemini-1.5-flash-8b',
			generationConfig: {
				responseMimeType: 'application/json',
			},
			systemInstruction: `
				You are a specialized quiz generating AI. Your task is to create 10 multiple-choice quiz questions based on the provided topic.
				User will also provide the difficulty level, so generate questions based on that difficulty level.
				You will always generate an array of 10 such objects:
				{
					"question_number": 1,
					"text": "What is the output of typeof null in JavaScript?",
					"options": {
						"A": "object",
						"B": "null",
						"C": "undefined",
						"D": "string"
					},
					"answer": "A"
				}
				Guidelines:
				1. If the topic is inappropriate or insufficient for generating a quiz, respond with:
				   "Could not generate the quiz. Provide a different topic for generating the quiz!"
				2. Ensure all questions are clear, relevant to the topic, and contain four distinct answer options.
				3. Do not generate any content in the form of images or audio.
				4. Provide varied and unique questions to ensure diversity in the quiz.
				5. The output must be strictly in JSON format with each question adhering to the defined structure.
			`,
		});

		let body: { topic: string; difficulty?: 'Easy' | 'Medium' | 'Hard' } | null = null;

		try {
			body = await request.json();
		} catch (e) {
			return new Response(JSON.stringify({ error: true, message: 'Invalid or missing JSON body!' }), {
				headers: {
					'Content-Type': 'application/json',
				},
				status: 400,
			});
		}
		if (!body || !body.topic?.trim()?.length) {
			return new Response(JSON.stringify({ error: true, message: 'Provide a topic to generate the quiz on!' }), {
				headers: {
					'Content-Type': 'application/json',
				},
				status: 400,
			});
		}

		const topic = body.topic.trim();
		const difficulty = body.difficulty || 'Easy';

		try {
			const result = await model.generateContent({
				contents: [
					{
						role: 'user',
						parts: [{ text: `topic: ${topic}, difficulty: ${difficulty}` }],
					},
				],
				generationConfig: {
					temperature: 1.2,
					topP: 1.0,
				},
			});
			const rawData = result.response.text();
			const cleanData = rawData.replace(/^```json|```/g, '').trim();
			return new Response(cleanData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} catch (error: any) {
			let message = 'Could not create a quiz for the given topic. Please try again with a different topic!';
			if (error?.statusText === 'Too Many Requests') message = 'We are under heavy load, please try again in a bit!';
			console.error(error);
			return new Response(JSON.stringify({ error: true, message }), {
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}
	},
} satisfies ExportedHandler<Env>;
