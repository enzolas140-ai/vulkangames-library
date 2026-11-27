# VulkanGames Library

Biblioteca web de emulação retrô no navegador com EmulatorJS. Use somente ROMs e firmware/BIOS que você possui ou tem autorização para utilizar.

## Publicação
1. Em **Settings → Pages**, escolha **GitHub Actions** como fonte.
2. O workflow `.github/workflows/pages.yml` executa testes automatizados antes de publicar a raiz do repositório na branch `main`.
3. URL esperada: https://enzolas140-ai.github.io/vulkangames-library/.

## Sistemas configurados
- Game Boy e Game Boy Color: sistema EmulatorJS `gb`, núcleo Gambatte.
- Game Boy Advance: `gba`, núcleo mGBA.
- NES: `nes`, núcleo FCEUmm.
- SNES: `snes`, núcleo Snes9x.
- Mega Drive: `segaMD`, núcleo Genesis Plus GX.
- PlayStation: `psx`, padrão PCSX-ReARMed; arquivos CHD selecionam Mednafen PSX HW.
- Nintendo DS: `nds`, núcleo melonDS.

## Formatos reconhecidos
- GB/GBC: `.gb`, `.gbc`
- GBA: `.gba`
- NES: `.nes`
- SNES: `.sfc`, `.smc`
- Mega Drive: `.md`, `.smd`, `.gen`
- PlayStation: `.cue` com todos os arquivos referenciados selecionados juntos; `.ccd` com o respetivo `.img`; playlists `.m3u`; `.pbp`, `.img`, `.mdf`, `.toc`, `.cbn`; CHD seleciona o núcleo Mednafen PSX HW.
- Nintendo DS: `.nds`
- Arquivos `.zip`: são enviados ao descompactador interno do EmulatorJS; informe o sistema quando o nome não terminar em um sufixo reconhecível como `.gba.zip` ou `.psx.zip`.

**Não marquei ISO como formato PS1 garantido:** o núcleo padrão PCSX-ReARMed não lista ISO entre suas extensões documentadas no pacote estável. CHD usa outro núcleo e depende de WebGL 2.

## Importação e BIOS
- ROMs locais ficam no navegador e não são enviadas ao servidor.
- Para discos PS1, selecione CUE/CCD/M3U e os arquivos associados juntos; a página cria um ZIP preservando os nomes para o EmulatorJS extrair.
- BIOS pode ser selecionada individualmente ou em conjunto (o conjunto é empacotado em ZIP). O suporte a pacote depende do núcleo. PlayStation normalmente requer BIOS compatível. melonDS requer BIOS ARM7, BIOS ARM9 e firmware para o modo BIOS.
- O catálogo só hospeda jogos comerciais quando há autorização explícita para distribuição pública. Os demais jogos e BIOS não são fornecidos e devem ser carregados localmente pelo visitante, conforme os direitos de uso.

## Controles, áudio e saves
O menu do EmulatorJS oferece mapeamento de teclado/gamepad, controles virtuais, volume, tela cheia e funções de save/load conforme o núcleo. O navegador/sistema operacional deve reconhecer o controle; áudio pode exigir interação inicial para liberar autoplay. IDs numéricos estáveis por jogo separam os dados de salvamento.

## Verificação
O workflow executa testes automatizados de sintaxe, mapeamento dos oito sistemas, IDs numéricos, importação ZIP, conjuntos de disco, BIOS e limpeza do emulador. A página também exibe diagnóstico de WebAssembly, WebGL 2, Gamepad API, áudio e JSZip.

**Limite importante:** testes automatizados de configuração não comprovam que um jogo inicia ou que gráficos, áudio, controles e salvamentos funcionam em hardware real. Para certificar cada console, ainda precisamos executar ROMs homebrew/de teste em navegador real e conferir o resultado. Os arquivos de teste devem ser fornecidos pelo usuário ou ter licença/permissão explícita.

## Catálogo
Edite `catalog.json`:
```json
{
  "games": [
    {
      "title": "Meu jogo homebrew",
      "system": "gba",
      "url": "https://exemplo.org/meu-jogo.gba",
      "cover": "https://exemplo.org/capa.png",
      "description": "Jogo homebrew autorizado"
    }
  ]
}
```
URLs remotas precisam permitir acesso público e CORS quando necessário. GitHub não é indicado para armazenar ROMs grandes.
