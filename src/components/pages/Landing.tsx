import { Link } from 'react-router-dom';
import { Bike, Calculator, Shield, TrendingUp, Users, MessageSquare, Building } from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'Hassas Değerleme',
    description: 'Gelişmiş algoritma ile motosikletinizin gerçek piyasa değerini öğrenin'
  },
  {
    icon: TrendingUp,
    title: 'Piyasa Analizi',
    description: 'Güncel piyasa trendlerini ve fiyat değişimlerini takip edin'
  },
  {
    icon: Shield,
    title: 'Güvenilir Veri',
    description: 'Binlerce gerçek satış verisine dayalı değerleme sistemi'
  }
];

const stats = [
  { value: '123+', label: 'Aktif Galeri', icon: Building },
  { value: '5000+', label: 'Aylık İşlem', icon: TrendingUp },
  { value: '15K+', label: 'Kayıtlı Kullanıcı', icon: Users },
  { value: '98%', label: 'Müşteri Memnuniyeti', icon: MessageSquare }
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bike className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MotorDegerle</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Kayıt Ol
              </Link>
              <Link
                to="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Panele Git
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white h-[calc(100vh-4rem)]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=2070&h=1000"
            alt="Sport Motorcycle"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-75"></div>
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto">
          <div className="relative h-full flex items-center z-10">
            <main className="w-full">
              <div className="sm:text-left lg:text-left lg:w-1/2 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Motosikletinizin</span>
                  <span className="block text-indigo-400">Gerçek Değerini Öğrenin</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
                  MotorDegerle, Türkiye'nin en kapsamlı motosiklet değerleme platformu. 
                  Gelişmiş algoritması ve geniş veri tabanı ile motosikletinizin 
                  gerçek piyasa değerini saniyeler içinde öğrenin.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Hemen Başlayın
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <stat.icon className="h-8 w-8 mx-auto text-indigo-600 mb-4" />
                <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Özellikler
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Neden MotorDegerle?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.title}
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}