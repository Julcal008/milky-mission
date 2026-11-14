# Windows setup — for Angelica (Experience) and Metsus (Data)

Two of the three contributors use Windows. Follow this once; it takes about 15 minutes.
Everything below runs in **PowerShell** (Windows Terminal recommended).

> If a command is not recognized, close and reopen PowerShell so the PATH refreshes.

---

## 1. Install the tools

```powershell
winget install --id Git.Git -e --source winget
winget install --id OpenJS.NodeJS.LTS -e --source winget
winget install --id GitHub.cli -e --source winget
```

Verify:

```powershell
git --version
node -v      # must be v24.x
npm -v
gh --version
```

If `winget` is unavailable, install Git and Node 24 from their official installers.

If PowerShell blocks `npm` with a script execution error, run once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## 2. Install OpenCode V2

```powershell
npm install -g @opencode/cli
opencode --version
```

Run `opencode` **inside the repository folder**. It reads `AGENTS.md` automatically.

## 3. Configure Git

Use the email associated with your GitHub account (or your GitHub `noreply` address).

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.autocrlf false
git config --global core.longpaths true
git config --global init.defaultBranch main
```

`core.autocrlf false` plus the repository's `.gitattributes` keeps line endings as LF,
so Windows and Linux produce identical diffs.

## 4. Sign in to GitHub

```powershell
gh auth login
```

Choose **GitHub.com → HTTPS → Login with a web browser**. A browser opens; sign in with
your own account. Never share tokens between contributors.

Accept the repository invitation first: open
<https://github.com/Julcal008/milky-mission> while signed in and accept the banner, or use
the link in the invitation email.

Verify access:

```powershell
gh repo view Julcal008/milky-mission
```

## 5. Clone and run

```powershell
cd $HOME\Documents
git clone https://github.com/Julcal008/milky-mission.git
cd milky-mission
npm ci
npm run dev
```

Open <http://localhost:5173>. The design system lives at
<http://localhost:5173/#/styleguide>.

Check that the project is healthy before writing code:

```powershell
npm run typecheck
npm test
npm run build
```

## 5.1 Enable the track guard (required)

Declare your track and activate the pre-commit hook:

```powershell
# Angelica
git config --local milky.track experience
# Metsus
git config --local milky.track data

git config --local core.hooksPath .githooks
```

From now on, a commit that touches files outside your track is rejected with a message
listing the allowed paths. That is the intended behavior: the file belongs to another
track. Do not use `--no-verify` to bypass it.

OpenCode also exposes three primary agents: `core`, `experience` and `data`. Select your
track agent when you start a session. Its edit permissions are limited to that track's
paths.

## 6. First branch

```powershell
git switch -c exp/design-board     # Track B
git switch -c data/catalogs-v1     # Track C
```

Commit in small steps, then:

```powershell
git pull --rebase origin main
git push -u origin <your-branch>
gh pr create --fill
```

Open the pull request, request a review from another track, and wait for CI.

## 7. Daily loop

```powershell
git switch main
git pull
git switch -c <track>/<topic>
# edit
npm run typecheck; npm test; npm run build
git add -A
git commit -m "feat(ui): design board layout"
git push -u origin <track>/<topic>
gh pr create --fill
```

Then update your state file (`docs/state/experience.md` or `docs/state/data.md`).

---

## Windows gotchas

| Symptom | Fix |
|---|---|
| `npm` blocked by execution policy | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `$HOME` empty in old PowerShell | Use `cd $env:USERPROFILE\Documents` |
| CRLF warnings or huge diffs | Confirm `core.autocrlf=false` and that `.gitattributes` exists |
| File renamed with only a case change (e.g. `Home.tsx` → `home.tsx`) | Windows is case-insensitive: rename with an intermediate name and `git mv` |
| Path too long | `git config --global core.longpaths true`; keep the clone near `C:\dev` |
| `npm ci` very slow | Exclude the repo folder from real-time antivirus scanning |
| Port 5173 busy | `npm run dev -- --port 5174` |
| Permission denied on push | Accept the invitation and run `gh auth status` |
| Two agents editing at once | One branch per person, one clone per person; never share a folder |

## What not to do

- Do not copy another contributor's token or `.git-credentials`.
- Do not run `prettier --write .` on someone else's branch.
- Do not edit files outside your track (`AGENTS.md`, section 2).
- Do not commit `node_modules`, `dist` or local `.env` files.

## If you get stuck

Write the exact command, the full error and what you tried in
`docs/state/experience.md` or `docs/state/data.md` under **Blockers**, and tell the team.
A five-minute fix beats an hour of guessing.
