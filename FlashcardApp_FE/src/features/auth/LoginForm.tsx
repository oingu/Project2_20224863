import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CircleCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/authService";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, authLoading, error } = useAuth();
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error: any) {
      console.log("Login error catched in form:", error);
    }
  };

  const onForgotPassword = () => {
    if (!form.getValues("email")) {
      form.setError("email", { type: "manual", message: "Please enter your email address to receive a password reset link" });
      return;
    }
    setIsForgotPassword(true);
  };

  const handleForgotPassword = async () => {
    await authService.forgotPassword(form.getValues("email"));
    setForgotPasswordSuccess("An email has been sent to you. Please check your inbox.");
    console.log("Password reset email sent to ", form.getValues("email"));
  };

  return (
    <Form {...form}>
      <Card className="space-y-4 py-4">
        <CardHeader className="w-md">
          {!isForgotPassword && (
            <>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your email and password to access your account</CardDescription>
            </>
          )}
          {isForgotPassword && (
            <>
              <CardTitle className="text-2xl">Reset password</CardTitle>
              <CardDescription>
                A password reset link will be sent to your email address.
                <br />
                After pressing "Sent email" button, check your inbox and follow the instructions to reset your password.
              </CardDescription>
            </>
          )}
          {forgotPasswordSuccess && (
            <div className="mt-6 flex items-center gap-2 rounded-md bg-green-200 p-3 text-sm text-green-500 dark:bg-green-700 dark:text-green-300">
              <CircleCheck className="h-4 w-4" />
              {forgotPasswordSuccess}
            </div>
          )}
          {error && (
            <div className="bg-destructive/15 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@example.com" {...field} autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isForgotPassword && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button type="button" variant="link" size="sm" className="p-0" onClick={onForgotPassword}>
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isForgotPassword && (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsForgotPassword(false)}>
                  Back to login
                </Button>
                <Button onClick={() => handleForgotPassword()}>Send email</Button>
              </div>
            )}
          </CardContent>
          {!isForgotPassword && (
            <CardFooter className="mt-6 flex flex-col">
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Button type="button" variant="link" className="p-0" onClick={() => navigate("/auth/register")}>
                  Sign up
                </Button>
              </div>
            </CardFooter>
          )}
        </form>
      </Card>
    </Form>
  );
}
