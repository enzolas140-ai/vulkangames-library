# VulkanGames Library

Biblioteca web de emulação retrô no navegador, com EmulatorJS. Use somente ROMs e firmware/BIOS que você possui ou tem autorização para utilizar.

## Publicar no GitHub Pages
1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. O workflow `.github/workflows/pages.yml` publica automaticamente a raiz do repositório quando houver push na branch `main`.
4. A URL esperada é https://enzolas140-ai.github.io/vulkangames-library/.

## Recursos da interface
- Catálogo editável em `catalog.json` com título, sistema, URL, capa e descrição.
- Pesquisa e filtro por sistema.
- Seleção de ROM local sem enviar o arquivo ao servidor.
- Extração de ZIP no navegador (JSZip) para ROMs de arquivo único.
- Campo para BIOS local, mantida apenas na sessão atual.
- EmulatorJS fornece menu de áudio/volume, tela cheia, mapeamento de teclado/controle, controles virtuais e ferramentas de save/load state, conforme o núcleo e o navegador.

## Sistemas configurados
GB, GBC, GBA, NES, SNES, Mega Drive, PlayStation e Nintendo DS. A presença na lista não significa que todos os formatos e núcleos foram testados em todos os navegadores/dispositivos.

## Formatos e limitações
- ZIP: extração local de arquivos reconhecidos; arquivos multi-track e discos PS1 podem exigir organização especial.
- PS1: prefira CHD ou CUE/BIN bem formado. A compatibilidade depende do núcleo e da BIOS correta.
- BIOS: alguns sistemas funcionam sem BIOS; outros exigem firmware específico. O site não distribui BIOS.
- Áudio pode exigir um clique/toque inicial por políticas de autoplay do navegador.
- Controles USB/Bluetooth dependem de o sistema operacional e navegador reconhecerem o gamepad. O mapeamento é feito no menu do EmulatorJS.
- Salvamentos e save states usam os recursos internos do EmulatorJS; comportamento e persistência variam conforme navegador, armazenamento e núcleo. Exporte backups importantes.

## Adicionar jogos ao catálogo
Edite `catalog.json`. Exemplo:
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
A hospedagem dos jogos precisa permitir acesso público e CORS quando necessário. Não armazene ROMs comerciais nem BIOS proprietárias sem autorização. GitHub não é indicado para arquivos grandes; use hospedagem adequada para conteúdo autorizado.

## Testes pendentes
A sintaxe do JavaScript da página foi verificada. Ainda é necessário testar execução real com ROMs homebrew/de teste em navegadores e controles físicos: áudio, mapeamento, saves, BIOS e formatos de disco não foram certificados apenas por análise estática.
