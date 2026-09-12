import { useEffect, useState } from 'react';
import { ShieldCheck, Save, Image as ImageIcon, Type, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';

// Tipo que simula a estrutura do que o administrador pode editar no site
type LayoutSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  marqueeText1: string;
  marqueeText2: string;
  marqueeText3: string;
};

// Simulando dados que viriam de um Banco de Dados (ou Edge Config / LocalStorage por agora)
const defaultSettings: LayoutSettings = {
  heroTitle: "Coleção de Inverno",
  heroSubtitle: "Vista-se de Confiança",
  heroImageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
  marqueeText1: "Parcele em até 10x sem juros",
  marqueeText2: "Troca grátis em até 30 dias",
  marqueeText3: "Frete grátis Sul e Sudeste",
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, reset } = useForm<LayoutSettings>({
    defaultValues: defaultSettings
  });

  // Proteção SEO
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    
    // Simular carregamento das configs ao entrar
    const saved = localStorage.getItem('site_settings');
    if (saved) {
      reset(JSON.parse(saved));
    }

    return () => {
      if (document.head.contains(meta)) {
        document.head.removeChild(meta);
      }
    };
  }, [reset]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha mockada para o front-end (num projeto real, isso é verificado numa API / Supabase)
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta.');
    }
  };

  const onSubmit = (data: LayoutSettings) => {
    setIsSaving(true);
    
    // Aqui no futuro enviamos para um Banco de Dados ou Edge Config da Vercel. 
    // Por enquanto, salvamos no localStorage para simular o estado.
    setTimeout(() => {
      localStorage.setItem('site_settings', JSON.stringify(data));
      setIsSaving(false);
      setSuccessMessage('Configurações salvas com sucesso! O site foi atualizado.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 border border-gray-200 shadow-sm max-w-md w-full rounded-sm text-center">
          <ShieldCheck className="w-12 h-12 text-[#C49A6C] mx-auto mb-4" />
          <h1 className="text-xl font-bold uppercase mb-2 text-[#1A1C1E]">Acesso Restrito</h1>
          <p className="text-gray-500 mb-6 text-sm">Por favor, insira a senha administrativa para editar o site.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha..."
              className="w-full border border-gray-300 p-3 rounded-sm text-center focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
            />
            <button type="submit" className="bg-[#1A1C1E] text-[#C49A6C] font-bold uppercase py-3 rounded-sm hover:bg-[#2A2D34] transition-colors">
              Entrar no Painel
            </button>
          </form>
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
            <p className="text-sm text-gray-500 mt-1">Gerencie os textos, banners e o layout do e-commerce.</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-red-500 font-bold hover:underline">Sair</button>
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
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo (Destaque)</label>
                <input 
                  {...register("heroSubtitle")}
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link da Imagem de Fundo</label>
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
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mensagem 2</label>
                <input 
                  {...register("marqueeText2")}
                  className="w-full border border-gray-300 p-2.5 rounded-sm text-sm focus:ring-2 focus:ring-[#C49A6C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mensagem 3</label>
                <input 
                  {...register("marqueeText3")}
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
              className="bg-[#1A1C1E] text-[#C49A6C] font-bold uppercase tracking-wide px-8 py-4 rounded-sm flex items-center gap-2 hover:bg-[#2A2D34] transition-colors shadow-md disabled:opacity-70"
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
