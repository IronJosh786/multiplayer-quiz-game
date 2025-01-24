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
import { UseAuth } from "./AuthProvider";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authenticate } from "@/lib/get-add-data";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";

const authSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
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
      email: "",
      password: "",
    },
  });

  const handleAuthentication = (values: z.infer<typeof authSchema>) => {
    mutation.mutate({ ...values, authType: page });
  };

  useEffect(() => {
    if (loading) return;
    if (isLoggedIn) navigate("/");
    setPage(location.pathname.slice(1));
  }, [location.pathname, loading]);

  const mutation = useMutation({
    mutationFn: authenticate,
    onMutate: () => {
      showLoadingToast("Authenticating");
    },
    onError: (error: any) => {
      toast.dismiss();
      showErrorToast(error);
    },
    onSuccess: () => {
      login();
      toast.dismiss();
      const previousPath = location?.state?.from?.pathname || "/";
      navigate(previousPath, { replace: true });
      showSuccessToast("Logged In");
    },
  });

  return (
    <div className="min-h-dvh flex justify-center items-center px-4">
      <Card className="mx-auto w-96">
        <CardHeader>
          <CardTitle className="text-2xl">
            {page === "signin" ? "Sign In" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {page === "signin"
              ? "Enter your credentials to sign in to your account"
              : "Enter email and password to create a new account"}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="abc@abc.com" {...field} />
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
                      <Input placeholder="Abc@123" {...field} />
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
          {page === "signin" ? (
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={"/signup"} className="underline">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to={"/signin"} className="underline">
                Sign In
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
