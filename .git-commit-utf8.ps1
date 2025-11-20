# Helper script para commits com UTF-8 correto no Windows
# Uso: .\.git-commit-utf8.ps1 "mensagem do commit"

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

# Configurar encoding UTF-8
$env:LANG = "pt_BR.UTF-8"
$env:LC_ALL = "pt_BR.UTF-8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Fazer commit com encoding correto
git -c i18n.commitencoding=utf-8 commit -m $Message

