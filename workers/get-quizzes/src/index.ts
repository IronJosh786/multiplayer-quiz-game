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
		});

		const body: { topic: string } = await request.json();
		const topic = body.topic;

		const prompt = `
            Create a JSON array containing 10 multiple-choice quiz questions on the topic "${topic}". Each question should adhere to the following structure:
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
            Ensure each question includes:
            1. A unique question number.
            2. A clearly stated question in the "text" field.
            3. Four distinct answer options labeled "A", "B", "C", and "D".
            4. The correct answer indicated in the "answer" field using the corresponding letter.
            5. Make sure to NEVER GENERATE IMAGES even if it is given in the prompt above.

            Return the output as an array of such question objects.
        `;

		try {
			const result = await model.generateContent(prompt);
			const data = JSON.parse(result.response.text());
			return new Response(JSON.stringify(data), {
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
