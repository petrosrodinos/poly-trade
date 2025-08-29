import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";

const LandingPage = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">TradeBot</span>
          </div>

          <div className="flex space-x-3">
            {isLoggedIn ? (
              <Link to={Routes.dashboard.root}>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to={Routes.auth.sign_in}>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to={Routes.auth.sign_up}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="text-center mb-24">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">🚀 Automated Trading</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Trading Bots
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">Connect your Binance account and choose from our pre-made trading bots. Monitor performance, track trades, and grow your portfolio automatically.</p>
          <div className="flex justify-center">
            {isLoggedIn ? (
              <Link to={Routes.dashboard.root}>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to={Routes.auth.sign_up}>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                  Start Trading Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </section>

        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Pre-Made Bots</CardTitle>
                <CardDescription className="text-gray-400">Choose from our collection of proven trading strategies and bot configurations</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Binance Integration</CardTitle>
                <CardDescription className="text-gray-400">Secure API connection to your Binance account for seamless trading execution</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Performance Tracking</CardTitle>
                <CardDescription className="text-gray-400">Monitor account performance, track individual bot trades, and analyze results</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose TradeBot?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Join thousands of traders who trust our platform for automated trading success</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Platform Features</h3>
              <div className="space-y-4">
                {["Connect your Binance account with secure API keys", "Choose from pre-configured trading bot strategies", "Real-time account performance monitoring", "Detailed trade history and bot performance tracking"].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Account Balance</span>
                  <span className="text-green-400 text-sm">+15.2%</span>
                </div>
                <div className="text-3xl font-bold text-white">$45,678.90</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Bots:</span>
                    <span className="text-white">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Trades:</span>
                    <span className="text-white">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-green-400">68%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-lg">Choose the plan that fits your trading goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Starter</CardTitle>
                <div className="text-3xl font-bold text-white">
                  $29<span className="text-lg text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">Perfect for beginners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Up to $10K portfolio", "5 pre-made bot strategies", "Email support", "Mobile app access", "Basic performance tracking"].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-white">Pro</CardTitle>
                <div className="text-3xl font-bold text-white">
                  $99<span className="text-lg text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">For serious traders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Up to $100K portfolio", "15+ pre-made bot strategies", "Priority support", "Advanced performance analytics", "API access", "Custom bot parameters"].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-white">
                  $299<span className="text-lg text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">For institutions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Unlimited portfolio", "All pre-made bot strategies", "Dedicated support", "White-label solution", "Advanced analytics", "Custom bot development"].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-24">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 text-center border border-slate-600">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Connect your Binance account and start using our pre-made trading bots today. Monitor performance and track trades in real-time.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-white/10 text-lg px-8 py-6">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-700 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TradeBot</span>
              </div>
              <p className="text-gray-400 text-sm">Automated trading made simple with AI-powered algorithms and real-time market analysis.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 TradeBot. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
