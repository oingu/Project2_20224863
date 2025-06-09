import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/authService";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  token: z.string().min(1, "Token is required"),
  fullName: z.string().min(1, "Username is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type VerifyOtpFormInputs = z.infer<typeof otpSchema>;
type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterEmailForm() {
  const { register, authLoading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [token, setToken] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const emailForm = useForm<Pick<RegisterFormInputs, "email">>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<VerifyOtpFormInputs>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const registerForm = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
      fullName: "",
      address: "",
      phone: "",
    },
  });

  const handleEmailSubmit = async (data: Pick<RegisterFormInputs, "email">) => {
    try {
      await authService.requestOtp(data.email);
      setOtpSent(true);
      setEmail(data.email);
      registerForm.setValue("email", data.email); // keep email in form state
    } catch (error: any) {
      emailForm.setError("email", { message: error.message || "Failed to send OTP" });
    }
  };

  const handleOtpSubmit = async (data: VerifyOtpFormInputs) => {
    console.log("OTP submit called", data);
    setOtpLoading(true);
    try {
      const result = await authService.verifyOtp(email, data.otp);
      setOtpVerified(true);
      setToken(result.token); // store the token for later use
      registerForm.setValue("token", result.token); // keep token in form state
    } catch (error: any) {
      otpForm.setError("otp", { message: error.message || "Invalid OTP" });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormInputs) => {
    try {
      await register({
        email,
        password: data.password,
        token,
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
      });
      navigate("/auth/login");
    } catch (error: any) {
      // Error is handled by context
    }
  };

  return (
    <Form {...registerForm}>
      <Card className="space-y-4 py-4">
        <CardHeader className="w-md">
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>

          </CardDescription>
          {error && (
            <div className="bg-destructive/15 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
        </CardHeader>

        {!otpSent && (
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={emailForm.control}
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
            </CardContent>
            <CardFooter className="mt-6 flex flex-col">
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? "Verifying..." : "Continue"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Button type="button" variant="link" className="p-0" onClick={() => navigate("/auth/login")}>
                  Sign in
                </Button>
              </div>
            </CardFooter>
          </form>
        )}

        {otpSent && !otpVerified && (
          <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <InputOTP type="otp" {...field} maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-6 flex flex-col">
              <Button type="submit" className="w-full" disabled={otpLoading}>
                {otpLoading ? "Verifying OTP..." : "Verify OTP"}
              </Button>
            </CardFooter>
          </form>
        )}

         {otpSent && otpVerified && (
          <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-6 flex flex-col">
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? "Registering..." : "Register"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </Form>
  );
}
