# VulkanGames Library

Biblioteca web de jogos retrô para arquivos que você possui ou tem autorização para usar.

## Como usar
1. Abra `index.html` localmente ou publique o repositório com GitHub Pages.
2. Use **Abrir arquivo** para selecionar uma ROM do seu dispositivo.
3. Escolha o sistema detectado ou ajuste manualmente e pressione **Jogar**.
4. Para jogos de PS1, selecione o arquivo de disco compatível (normalmente .cue, .chd, .pbp ou .iso; suporte depende do núcleo).

## Catálogo remoto
Edite `catalog.json` para adicionar jogos homebrew, de domínio público ou distribuídos com licença/permissão. Cada entrada pode conter:
- `title`: nome exibido
- `system`: gb, gbc, gba, nes, snes, megadrive, psx ou nds
- `url`: URL direta do arquivo do jogo, com hospedagem que permita CORS
- `cover`: URL opcional da capa
- `description`: descrição curta

**Não coloque ROMs comerciais nem BIOS proprietárias sem autorização.** GitHub não é adequado para armazenar ROMs grandes; mantenha aqui o catálogo e use hospedagem apropriada para arquivos autorizados. Arquivos escolhidos no botão de upload são carregados localmente no navegador e não são enviados ao GitHub.

## BIOS e formatos
Alguns sistemas funcionam sem BIOS; outros podem exigir firmware/BIOS compatível. O site não distribui BIOS. A compatibilidade de ZIP e formatos de disco varia por núcleo do emulador. Para PS1, prefira CHD ou CUE/BIN corretamente organizados.

## Publicar
No GitHub: **Settings → Pages → Deploy from a branch → main → / (root)**.
