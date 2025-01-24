import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  axiosInstance,
  showErrorToast,
  showSuccessToast,
  showLoadingToast,
} from "@/lib/utils";
import { z } from "zod";
import Loader from "./Loader";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { UseAuth } from "./AuthProvider";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchQuotes, postQuote } from "@/lib/get-add-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type QuotesType = {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
};

const quoteSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, {
      message: "Quote must be of at least 10 characters.",
    })
    .max(50, {
      message: "Quote can be of at most 50 characters.",
    }),
});

const Quote = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn, logout } = UseAuth();

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      text: "",
    },
  });

  const handleNewQuote = (value: z.infer<typeof quoteSchema>) => {
    mutation.mutate(value.text);
  };

  const { isLoading, data, isError } = useQuery<QuotesType[]>({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: postQuote,
    onMutate: (variables) => {
      showLoadingToast("Posting");
      const previousQuotes = data;
      queryClient.setQueryData(
        ["quotes"],
        [{ id: "temp", text: variables }, ...(data || [])]
      );
      return { previousQuotes };
    },
    onError: (error, _, context) => {
      toast.dismiss();
      showErrorToast(error);
      queryClient.setQueryData(["quotes"], context?.previousQuotes);
    },
    onSuccess: async (data, _, context) => {
      form.reset();
      toast.dismiss();
      queryClient.setQueryData(
        ["quotes"],
        [data.data, ...(context?.previousQuotes || [])]
      );
      showSuccessToast("Quote Posted");
    },
  });

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      logout();
      showSuccessToast("Logged out");
    } catch (error: any) {
      showErrorToast("Already Logged out");
    }
  };

  return (
    <>
      <div className="grid w-full gap-2 bg-background my-4 sticky top-0 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleNewQuote)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-center">New Quote</FormLabel>
                  <FormControl>
                    <Input
                      className="py-6"
                      placeholder="Write a new quote..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              Post Quote
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center">
        {isLoading && <Loader />}
        {!isLoading && isError && <div>An error occurred</div>}
        {!isLoading && !data?.length && <div>No quotes to show</div>}
      </div>
      {!isLoading && data && data?.length > 0 && (
        <div className="flex flex-col flex-grow">
          {data?.map((quote) => (
            <div
              className={`${
                quote.id === "temp" ? "bg-slate-900" : "bg-slate-800"
              } rounded-md p-2 mb-4`}
              key={quote.id}
            >
              <p className="text-center">{quote.text}</p>
            </div>
          ))}
        </div>
      )}
      <div
        className={`mt-auto flex ${
          isLoggedIn ? "justify-between" : "justify-center"
        } items-center`}
      >
        {isLoggedIn && (
          <Button onClick={handleLogout} variant={"link"} className="p-0">
            Logout
          </Button>
        )}
        <Link to={"/secretquote"} className="text-center text-muted">
          Secret Quote
        </Link>
      </div>
    </>
  );
};

export default Quote;
