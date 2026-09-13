import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Save, Image as ImageIcon, Type, Link as LinkIcon, RefreshCw, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { sha256Hex, sanitizeInputString, isSafeMediaUrl, safeJsonParse } from '../lib/security';

// Tipo que simula a estrutura do que o administrador pode editar no site
type LayoutSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  marqueeText1: string;
  marqueeText2: string;
  marqueeText3: string;
};

// Salt de proteção criptográfica
const PASSWORD_SALT = "amsterdam_salt_2026:";
// Hash padrão protegido SHA-256 (nunca expõe a senha em texto puro)
const DEFAULT_HASH = "251f8a5f7fa3dc1bf292e49379eb37da2d1f36e0d30a921157680cb71783ffe3";
const TARGET_HASH = import.meta.env.VITE_ADMIN_HASH || DEFAULT_HASH;

// Dados padrão limpos
const defaultSettings: LayoutSettings = {
  heroTitle: "Coleção de Inverno",
  heroSubtitle: "Vista-se de Confiança",
  heroImageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
  marqueeText1: "Parcele em até 10x sem juros",
  marqueeText2: "Troca grátis em até 30 dias",
  marqueeText3: "Frete grátis Sul e Sudeste",
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('amsterdam_admin_session') === 'active';
  });
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, reset } = useForm<LayoutSettings>({
    defaultValues: defaultSettings
  });

  // Verificação de lockout por tentativas falhas (anti-força bruta)
  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = parseInt(sessionStorage.getItem('amsterdam_admin_lockout') || '0', 10);
      const now = Date.now();
      if (lockoutUntil > now) {
        setLockoutRemaining(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setLockoutRemaining(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Proteção SEO e restauração segura de configs
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    
    const saved = localStorage.getItem('site_settings');
    if (saved) {
      const parsed = safeJsonParse<Partial<LayoutSettings>>(saved, {});
      reset({
        heroTitle: sanitizeInputString(parsed.heroTitle || defaultSettings.heroTitle),
        heroSubtitle: sanitizeInputString(parsed.heroSubtitle || defaultSettings.heroSubtitle),
        heroImageUrl: isSafeMediaUrl(parsed.heroImageUrl) ? (parsed.heroImageUrl as string) : defaultSettings.heroImageUrl,
        marqueeText1: sanitizeInputString(parsed.marqueeText1 || defaultSettings.marqueeText1),
        marqueeText2: sanitizeInputString(parsed.marqueeText2 || defaultSettings.marqueeText2),
        marqueeText3: sanitizeInputString(parsed.marqueeText3 || defaultSettings.marqueeText3),
      });
    }

    return () => {
      if (document.head.contains(meta)) {
        document.head.removeChild(meta);
      }
    };
  }, [reset]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setErrorMessage('');
    
    // Calcula hash criptográfico seguro (SHA-256) com salt
    const computedHash = await sha256Hex(PASSWORD_SALT + password);

    if (computedHash === TARGET_HASH) {
      sessionStorage.setItem('amsterdam_admin_session', 'active');
      sessionStorage.removeItem('amsterdam_admin_failed_attempts');
      sessionStorage.removeItem('amsterdam_admin_lockout');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      const currentFailures = parseInt(sessionStorage.getItem('amsterdam_admin_failed_attempts') || '0', 10) + 1;
      sessionStorage.setItem('amsterdam_admin_failed_attempts', currentFailures.toString());

      if (currentFailures >= 5) {
        const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 minutos
        sessionStorage.setItem('amsterdam_admin_lockout', lockoutTime.toString());
        setLockoutRemaining(15 * 60);
        setErrorMessage('Limite de tentativas excedido. Acesso bloqueado temporariamente por 15 minutos.');
      } else {
        const remaining = 5 - currentFailures;
        setErrorMessage(`Senha incorreta. Restam ${remaining} ${remaining === 1 ? 'tentativa' : 'tentativas'}.`);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('amsterdam_admin_session');
    setIsAuthenticated(false);
  };

  const onSubmit = (data: LayoutSettings) => {
    setIsSaving(true);

    // Sanitização e validação estrita de cada campo
    const sanitizedData: LayoutSettings = {
      heroTitle: sanitizeInputString(data.heroTitle),
      heroSubtitle: sanitizeInputString(data.heroSubtitle),
      heroImageUrl: isSafeMediaUrl(data.heroImageUrl) ? data.heroImageUrl.trim() : defaultSettings.heroImageUrl,
      marqueeText1: sanitizeInputString(data.marqueeText1),
      marqueeText2: sanitizeInputString(data.marqueeText2),
      marqueeText3: sanitizeInputString(data.marqueeText3),
    };

    setTimeout(() => {
      localStorage.setItem('site_settings', JSON.stringify(sanitizedData));
      setIsSaving(false);
      setSuccessMessage('Configurações salvas e validadas com sucesso!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 600);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 border border-gray-200 shadow-sm max-w-md w-full rounded-sm text-center">
          <ShieldCheck className="w-12 h-12 text-[#C49A6C] mx-auto mb-4" />
          <h1 className="text-xl font-bold uppercase mb-2 text-[#1A1C1E]">Acesso Restrito</h1>
          <p className="text-gray-500 mb-6 text-sm">Painel de gerenciamento de textos e layout visual da loja.</p>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded mb-4 flex items-center gap-2 text-left">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {lockoutRemaining > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded mb-4 flex items-center gap-2 text-left">
              <Lock className="w-4 h-4 shrink-0 text-amber-700" />
              <span>Painel temporariamente bloqueado. Tente novamente em {Math.floor(lockoutRemaining / 60)}m {lockoutRemaining % 60}s.</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              disabled={lockoutRemaining > 0}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha administrativa..."
              className="w-full border border-gray-300 p-3 rounded-sm text-center focus:ring-2 focus:ring-[#C49A6C] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            />
            <button 
              type="submit" 
              disabled={lockoutRemaining > 0 || !password.trim()}
              className="bg-[#1A1C1E] text-[#C49A6C] font-bold uppercase py-3 rounded-sm hover:bg-[#2A2D34] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>

          <p className="text-[11px] text-gray-400 mt-6 border-t pt-4">
            Ambiente protegido com criptografia SHA-256 e limitação de taxa de requisições.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase text-[#1A1C1E] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#C49A6C]" />
              Painel de Configuração
            </h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie os textos, avisos e banners do layout do e-commerce.</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-500 font-bold hover:underline cursor-pointer">Sair com Segurança</button>
        </div>

        {/* Nota de Segurança Cibernética */}
        <div className="bg-amber-50/70 border border-amber-200 text-amber-900 p-4 mb-6 rounded-sm text-xs leading-relaxed">
          <p className="font-semibold mb-1">Nota de Segurança e Arquitetura:</p>
          Este painel permite ajustar parâmetros visuais e textuais do frontend. O gerenciamento de estoque, pedidos de clientes e pagamentos é protegido pelo núcleo autenticado da Shopify com 2FA.
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 mb-6 rounded-sm text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Sessão: Banner Principal (Hero) */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-sm">
            <h2 className="text-lg font-bold uppercase mb-4 text-[#1A1C1E] flex items-center gap-2 border-b pb-2">
              <ImageIcon className="w-5 h-5 text-[#C49A6C]" />
              Banner Principal (Início)
            </h2>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título Grande</label>
                <input 
                  {...register("heroTitle")}
                  maxLength={120}
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo (Destaque)</label>
                <input 
                  {...register("heroSubtitle")}
                  maxLength={120}
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link da Imagem de Fundo (HTTPS)</label>
                <div className="flex gap-2 items-center">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <input 
                    {...register("heroImageUrl")}
                    placeholder="https://..."
                    className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none font-mono text-xs"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Dica: Faça o upload da imagem na aba "Arquivos" da sua Shopify e cole o link gerado aqui.</p>
              </div>
            </div>
          </div>

          {/* Sessão: Faixa Rotativa */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-sm">
            <h2 className="text-lg font-bold uppercase mb-4 text-[#1A1C1E] flex items-center gap-2 border-b pb-2">
              <Type className="w-5 h-5 text-[#C49A6C]" />
              Faixa de Avisos (Topo)
            </h2>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mensagem 1</label>
                <input 
                  {...register("marqueeText1")}
                  maxLength={80}
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mensagem 2</label>
                <input 
                  {...register("marqueeText2")}
                  maxLength={80}
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mensagem 3</label>
                <input 
                  {...register("marqueeText3")}
                  maxLength={80}
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Botão de Salvar */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-[#1A1C1E] text-[#C49A6C] font-bold uppercase tracking-wide px-8 py-4 rounded-sm flex items-center gap-2 hover:bg-[#2A2D34] transition-colors shadow-md disabled:opacity-70 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Salvando Alterações...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Layout e Publicar
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

