"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  Phone,
  Mail,
  User,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberFieldDisabled, setNumberFieldDisabled] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Field States
  const [loginField, setLoginField] = useState(false);
  const [registrationField, setRegistrationField] = useState(false);
  const [OtpField, setOtpField] = useState(false);

  // Phone Number Functions
  const handleSearchNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/auth/check`,
        { mobile: phoneNumber },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (!data.success) {
        toast.error("Search failed", {
          description: data.message || "Something went wrong",
        });
        setPhoneNumber("");
        return;
      }

      if (data.step === "login") {
        setLoginField(true);
        setNumberFieldDisabled(true);
        toast.info("Account found", {
          description: "Please enter your password to continue",
        });
      } else if (data.step === "register") {
        setRegistrationField(true);
        setOtpField(false);
        setNumberFieldDisabled(true);
        toast("Customer account not found", {
          description: "Please create your account",
          action: {
            label: "Sign up",
            onClick: () => router.push("/signup"),
          },
        });
      } else if (data.step === "otp") {
        setOtpField(true);
        setRegistrationField(false);
        setNumberFieldDisabled(true);
        toast("Customer account not found", {
          description: "Please create your account",
          action: {
            label: "OTP",
            onClick: () => router.push("/otp"),
          },
        });
      } else {
        toast.warning("Unexpected response", {
          description: data.message || "Unknown step from server",
        });
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error("Search failed", {
        description:
          error.response?.data?.message ||
          error.message ||
          "An error occurred while searching",
      });
      setPhoneNumber("");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Functions
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/auth/otp`,
        { mobile: phoneNumber },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (data.success) {
        toast.success("OTP sent successfully");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("OTP error:", error);
      toast.error("OTP failed", {
        description:
          error.response?.data?.message ||
          error.message ||
          "An error occurred while sending OTP",
      });
      setPhoneNumber("");
    } finally {
      setIsLoading(false);
    }
  };

  // Login Functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginData = {
        mobile: phoneNumber,
        password: password,
      };

      console.log(loginData);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/auth/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", data.token);

      toast.success("Login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Travel<span className="text-purple-600">Hub</span>
              </Link>
            </div>
            {/* <Link href="/" className="text-2xl font-bold text-blue-600">
              Travel<span className="text-purple-600">Hub</span>
            </Link> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-sm border-0 p-2">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Sign in to your Durpalla account to continue your journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Phone Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      disabled={numberFieldDisabled}
                      id="phone"
                      type="number"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                        numberFieldDisabled
                          ? "cursor-not-allowed border border-red-500"
                          : ""
                      }`}
                      required
                    />
                  </div>
                </div>

                {loginField && (
                  <>
                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          Remember me
                        </Label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Login Button */}
                    <Button
                      onClick={handleLogin}
                      disabled={password.trim() === ""}
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Sign In
                    </Button>
                  </>
                )}

                {OtpField && (
                  <div>
                    <div className="space-y-2 mb-5">
                      <Label
                        htmlFor="otp"
                        className="text-sm font-medium text-gray-700"
                      >
                        OTP
                      </Label>
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <InputOTP maxLength={6} onChange={setOtp} value={otp}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      disabled={otp.length !== 6}
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Confirm
                    </Button>
                  </div>
                )}

                {registrationField && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium text-gray-700"
                        >
                          First Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="First name"
                            // value={formData.firstName}
                            // onChange={(e) =>
                            //   handleInputChange("firstName", e.target.value)
                            // }
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last name"
                          // value={formData.lastName}
                          // onChange={(e) =>
                          //   handleInputChange("lastName", e.target.value)
                          // }
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          // value={formData.email}
                          // onChange={(e) =>
                          //   handleInputChange("email", e.target.value)
                          // }
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    {/* <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div> */}

                    {/* Confirm Password Field */}
                    {/* <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div> */}
                  </>
                )}

                {loginField || registrationField || OtpField ? null : (
                  <Button
                    onClick={handleSearchNumber}
                    disabled={phoneNumber.trim() === ""}
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Search
                  </Button>
                )}
              </div>

              {/* Divider */}
              {/* <div className="relative">
                <Separator className="my-6" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                  Or continue with
                </span>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
    </div>
  );
}
