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

## Ports Linux ARM64 (experimental)

A rota **Ports Linux ARM64 (experimental)** abre um launcher baseado no runtime GEX (Linux AArch64 em WebAssembly). Ele aceita ZIP ou pasta local, monta os arquivos em um userspace Linux e inicia um ELF AArch64 ou script Linux. Gráficos convidados OpenGL/OpenGL ES passam pela camada Mesa do GEX e pelo WebGPU do navegador; áudio usa Web Audio e controles usam a Gamepad API.

- Requer navegador moderno com WebGPU para gráficos acelerados (Chrome/Edge atual recomendado).
- O perfil de Zombie Tsunami reconhece o loader ELF AArch64 do pacote PortMaster, usa ABI glibc, inclui dependências ARM64 de SDL2/FreeType/zlib e tenta selecionar SDL2/X11 para desenhar pelo Xwayland/Mesa/WebGPU.
- O loader do port não é um APK: ele carrega sua própria biblioteca JNI e assets. O perfil ignora o script PortMaster e abre o loader diretamente, com a pasta de dados do jogo configurada.
- Não emula o DRM/KMS do dispositivo, nem garante que a inicialização SDL2, FMOD ou chamadas específicas do loader funcionem no GEX. APK/XAPK Android comuns, Bionic e serviços Android continuam fora do escopo.
- Cada port precisa das bibliotecas, assets e ABI corretos. Isso não significa que todo executável ARM64 funcione.
- O runtime é montado automaticamente pelo workflow de Pages usando a revisão registrada em `arm64-runtime.lock`. O código e as licenças GEX são publicados em `arm64/runtime/`; GEX é AGPL-3.0-only.

**Status:** camada genérica Linux AArch64 experimental. O launcher contém um teste inicial `uname -m`; a compatibilidade de cada jogo ainda precisa ser comprovada individualmente. Em particular, um port com bibliotecas Android/JNI não passa a ser compatível apenas por ter um loader ARM64.

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
- O site não fornece jogos comerciais nem BIOS.

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


## Central de emuladores

A página `emulators/` separa os emuladores da biblioteca de jogos. O TabStationToo (PCSX2 para WebAssembly) é preparado pelo workflow de publicação dentro de `emulators/ps2/`, com o código-fonte e as licenças GPL-3.0 correspondentes.

- Emuladores: https://enzolas140-ai.github.io/vulkangames-library/emulators/
- Configurações: https://enzolas140-ai.github.io/vulkangames-library/emulators/settings.html
- O modo de abertura pode ser configurado como página dedicada ou janela incorporada na central.
- Idioma português/inglês traduz as páginas VulkanGames; a interface interna do TabStationToo permanece em inglês no upstream atual.
- Renderizador, resolução e filtro são gravados nas mesmas chaves locais usadas pelo TabStationToo (`pcsx2web.renderer`, `pcsx2web.upscale`, `pcsx2web.picture`).
- A RAM é gerenciada automaticamente pelo navegador/WebAssembly. O site não tenta reservar nem limitar RAM física; quando o navegador oferece suporte, a tela de configurações pode mostrar uma estimativa.
- O TabStationToo é experimental e requer BIOS de PS2 e imagens de disco obtidas pelo usuário de cópias próprias. O site não distribui esses arquivos.
