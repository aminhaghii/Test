import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as const, name: 'English', nativeName: 'English' },
    { code: 'fa' as const, name: 'Persian', nativeName: 'فارسی' },
    { code: 'ar' as const, name: 'Arabic', nativeName: 'العربية' },
    { code: 'es' as const, name: 'Spanish', nativeName: 'Español' },
    { code: 'it' as const, name: 'Italian', nativeName: 'Italiano' },
  ];

  const currentLangName = languages.find(l => l.code === currentLanguage)?.nativeName || 'English';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLangName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={currentLanguage === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.nativeName}</span>
            <span className="text-muted-foreground text-sm">({lang.name})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
