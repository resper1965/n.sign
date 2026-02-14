'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PenTool, 
  BookOpen, 
  CreditCard, 
  Mail, 
  Presentation, 
  Share2,
  FileText,
  Newspaper,
  Shield,
  Loader2,
  LogOut,
  User,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Module definitions
const modules = [
  {
    id: 'assinaturas',
    name: 'Signatures',
    description: 'Create and manage professional email signatures',
    icon: PenTool,
    color: 'text-[#00ade8]',
    bgColor: 'bg-[#00ade8]/10',
    status: 'active' as const,
    href: '/assinaturas',
  },
  {
    id: 'manual-marca',
    name: 'Brand Manual',
    description: 'Guidelines, logos, colors and usage rules',
    icon: BookOpen,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    status: 'active' as const,
    href: '/manual-marca',
  },
  {
    id: 'cartao-visita',
    name: 'Business Cards',
    description: 'Generate digital and print business cards',
    icon: CreditCard,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    status: 'active' as const,
    href: '/cartao-visita',
  },
  {
    id: 'templates-email',
    name: 'Email Templates',
    description: 'Ready-to-use email marketing templates',
    icon: Mail,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    status: 'active' as const,
    href: '/templates-email',
  },
  {
    id: 'apresentacoes',
    name: 'Presentations',
    description: 'Corporate presentation templates',
    icon: Presentation,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    status: 'active' as const,
    href: '/apresentacoes',
  },
  {
    id: 'redes-sociais',
    name: 'Social Media',
    description: 'Assets and guidelines for social media',
    icon: Share2,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    status: 'active' as const,
    href: '/redes-sociais',
  },
  {
    id: 'propostas',
    name: 'Proposals',
    description: 'Standardized commercial proposal templates',
    icon: FileText,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    status: 'active' as const,
    href: '/propostas',
  },
  {
    id: 'press-kit',
    name: 'Press Kit',
    description: 'Press releases and media materials',
    icon: Newspaper,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    status: 'active' as const,
    href: '/press-kit',
  },
];

const statusLabels = {
  'active': 'Disponível',
  'coming-soon': 'Em breve',
  'planned': 'Planejado',
};

const statusColors = {
  'active': 'bg-green-100 text-green-700',
  'coming-soon': 'bg-amber-100 text-amber-700',
  'planned': 'bg-slate-100 text-slate-500',
};

export default function Dashboard() {
  const { user, userProfile, loading, error, isConfigured, isDemoMode, signInWithGoogle, signInDemo, signOut } = useAuth();
  const router = useRouter();

  // Handle Google Sign In
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso.',
      });
    } catch (err) {
      toast({
        title: 'Erro ao autenticar',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Até logo!',
        description: 'Você saiu da sua conta.',
      });
    } catch {
      toast({
        title: 'Erro ao sair',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#00ade8] mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user && !isDemoMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 text-center max-w-md w-full">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1 text-5xl font-bold text-white mb-2">
              ness<span className="text-[#00ade8]">.</span>MKT
            </div>
            <p className="text-slate-400">Marketing Toolkit</p>
            <p className="text-slate-500 text-xs mt-1">part of ness.OS</p>
          </div>

          {/* Login Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">Restricted Access</CardTitle>
              <CardDescription className="text-slate-300">
                Only @ness.com.br employees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Firebase not configured warning */}
              {!isConfigured && (
                <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-200 text-sm mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="text-left">
                      <p className="font-medium">Firebase not configured</p>
                      <p className="text-xs mt-1 opacity-80">
                        Configure environment variables or use demo mode to test.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {isConfigured ? (
                <Button
                  onClick={handleSignIn}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 h-12 text-base font-medium gap-3"
                  size="lg"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={signInDemo}
                    className="w-full bg-[#00ade8] text-white hover:bg-[#00ade8]/90 h-12 text-base font-medium"
                    size="lg"
                  >
                    Demo Mode
                  </Button>
                  <p className="text-xs text-slate-400">
                    Enter demo mode to test the application
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Shield className="h-4 w-4" />
            <span>Autenticação segura via Google</span>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-slate-900">
                ness<span className="text-[#00ade8]">.</span>MKT
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* Demo Mode Badge */}
              {isDemoMode && (
                <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  Modo Demo
                </div>
              )}
              
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {userProfile?.firstName || user?.displayName?.split(' ')[0] || 'Usuário'}
                </p>
                <p className="text-xs text-slate-500">{userProfile?.area || 'NESS'}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-500 hover:text-slate-700"
                  title="Configurações"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#00ade8] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-slate-500 hover:text-slate-700"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Olá, {userProfile?.firstName || user?.displayName?.split(' ')[0] || 'colaborador'}!
          </h1>
          <p className="text-slate-600">
            Acesse as ferramentas de marketing da NESS para criar materiais profissionais.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#00ade8]/10">
                <PenTool className="h-6 w-6 text-[#00ade8]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-500">Assinaturas criadas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">24</p>
                <p className="text-sm text-slate-500">Assets da marca</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">8</p>
                <p className="text-sm text-slate-500">Módulos disponíveis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Módulos</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            const isDisabled = module.status !== 'active';
            
            return (
              <Card
                key={module.id}
                className={`group cursor-pointer transition-all duration-200 ${
                  isDisabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-lg hover:border-[#00ade8]/50 hover:-translate-y-1'
                }`}
                onClick={() => {
                  if (!isDisabled) {
                    router.push(module.href);
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg ${module.bgColor}`}>
                      <Icon className={`h-5 w-5 ${module.color}`} />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[module.status]}`}>
                      {statusLabels[module.status]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base font-semibold text-slate-900 mb-1">
                    {module.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500 line-clamp-2">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-900">ness<span className="text-[#00ade8]">.</span>OS</span>
              <span className="text-slate-300">|</span>
              <span>ness.MKT v1.0</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="https://www.ness.com.br" className="hover:text-slate-700" target="_blank" rel="noopener noreferrer">
                ness.com.br
              </a>
              <a href="mailto:resper@ness.com.br" className="hover:text-slate-700">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
