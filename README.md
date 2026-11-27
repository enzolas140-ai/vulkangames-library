# VulkanGames Library

Biblioteca web de emulação retrô no navegador com EmulatorJS. Use somente ROMs e firmware/BIOS que você possui ou tem autorização para utilizar.

## Publicação
1. Em **Settings → Pages**, escolha **GitHub Actions** como fonte.
2. O workflow `.github/workflows/pages.yml` executa os testes automatizados e publica a raiz do repositório na branch `main`.
3. URL esperada: https://enzolas140-ai.github.io/vulkangames-library/.

## Sistemas e identificadores
A configuração usa os identificadores de sistema documentados pelo EmulatorJS:
- GB e GBC: `gb` (o mesmo núcleo Gambatte suporta ambos)
- GBA: `gba`
- NES: `nes`
- SNES: `snes`
- Mega Drive: `segaMD`
- PlayStation: `psx`
- Nintendo DS: `nds`

## Importação
- ROM individual: selecione o arquivo; quando a extensão não identifica o console, a página pergunta o sistema.
- ZIP: o arquivo é passado ao descompactador do EmulatorJS, que tem suporte próprio a arquivos compactados.
- PS1 CUE/BIN: selecione o CUE e todos os arquivos referenciados por ele de uma vez. O site empacota os arquivos mantendo os nomes e caminhos, para o emulador poder resolver as faixas. CHD/PBP/ISO podem ser selecionados individualmente conforme suporte do núcleo.
- BIOS: selecione um arquivo ou vários arquivos juntos; a seleção múltipla é empacotada em ZIP e mantida localmente nesta sessão. A aceitação de pacotes BIOS depende do núcleo. Nintendo DS com melonDS normalmente precisa do conjunto BIOS7, BIOS9 e firmware; PlayStation normalmente precisa de BIOS compatível. O site não fornece BIOS.

## Controles, áudio e saves
O menu do EmulatorJS oferece mapeamento de teclado/gamepad, controles virtuais, volume, tela cheia e funções de save/load quando suportadas pelo núcleo. O navegador e o sistema operacional precisam reconhecer o controle. O áudio pode precisar de uma interação inicial para desbloquear o autoplay. IDs numéricos estáveis por jogo ajudam a separar os dados de salvamento.

## Testes e limitações
O workflow executa testes automatizados de sintaxe, mapeamento dos oito sistemas, IDs, importação de arquivos, tratamento de CUE/BIN, BIOS e limpeza do emulador. Isso **não** equivale a um teste de jogo real: para certificar inicialização, gráficos, som, controle e salvamento em cada console, ainda é necessário abrir ROMs de teste/homebrew apropriadas em um navegador real. A página também mostra diagnóstico de WebAssembly, WebGL 2, Gamepad API e áudio.

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
URLs remotas precisam permitir acesso público e CORS quando necessário. Não hospede ROMs comerciais nem BIOS proprietárias sem autorização. GitHub não é indicado para arquivos grandes.
