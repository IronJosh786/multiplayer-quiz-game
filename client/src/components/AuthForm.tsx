import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/utils";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Lead, Muted } from "./ui/typography";
import { Button } from "@/components/ui/button";
import { authenticate } from "@/lib/get-add-data";
import { UseAuth } from "../provider/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";

const authSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, { message: "Username must be of at least 4 characters." })
    .max(8, { message: "Username can be of atmost 8 characters." }),
  password: z.string().trim().min(8, {
    message: "Password must be of at least 8 characters.",
  }),
});

export function AuthForm() {
  const [page, setPage] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, loading, login } = UseAuth();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleAuthentication = (values: z.infer<typeof authSchema>) => {
    mutation.mutate({ ...values, authType: page });
  };

  useEffect(() => {
    if (loading) return;
    if (!loading && isLoggedIn) navigate("/home");
    setPage(location.pathname.slice(1));
  }, [location.pathname, loading, isLoggedIn]);

  const mutation = useMutation({
    mutationFn: authenticate,
    onMutate: () => {
      showLoadingToast("Authenticating");
    },
    onError: (error: any) => {
      toast.dismiss();
      showErrorToast(error);
    },
    onSuccess: (data) => {
      login(data.data.id, data.data.username);
      toast.dismiss();
      const previousPath = location?.state?.from?.pathname || "/home";
      navigate(previousPath, { replace: true });
      showSuccessToast("Logged In");
    },
  });

  return (
    <div className="flex-1 flex justify-center items-center px-4">
      <Card className="mx-auto w-96">
        <CardHeader>
          <CardTitle>
            <Lead>{page === "signin" ? "Sign In" : "Sign Up"}</Lead>
          </CardTitle>
          <CardDescription>
            {page === "signin"
              ? "Enter your credentials to sign in to your account"
              : "Fill up the form to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAuthentication)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john"
                        onChange={(e) =>
                          field.onChange(e.target.value.toLowerCase())
                        }
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Abc@123" {...field} />
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
                {page === "signin" ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Muted>
              {page === "signin"
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                to={page === "signin" ? "/signup" : "/signin"}
                className="underline"
              >
                {page === "signin" ? "Sign Up" : "Sign In"}
              </Link>
            </Muted>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
