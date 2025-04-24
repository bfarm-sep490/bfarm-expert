# BFarmX Expert

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- Refine - For rapid CRUD application development
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/) - UI Framework
- [Vite](https://vitejs.dev/) - Build tool
- [i18next](https://www.i18next.com/) - Internationalization
- [Google Maps](https://developers.google.com/maps) - Location services

## 📋 Prerequisites

- Node.js (v16 or higher)
- Bun (latest version)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/bfarm-sep490/bfarm-front.git
   cd bfarm-front
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun run dev
   ```

4. **Start the mock API server**
   ```bash
   bun run serve
   ```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Create a production build
- `bun run start` - Start the production server
- `bun run serve` - Start the mock API server
- `bun run prepare` - Prepare Husky hooks

## 🔧 Configuration

The application can be configured through various configuration files:

- `.env` - Environment variables
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration

## 🌐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_APP_API_URL=api_url
VITE_GOOGLE_MAPS_API_KEY=google_maps_api_key
```

## 🤝 Contributing

### Local Development Flow
1. Create a new branch for your feature
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. Make your changes and commit frequently
   ```bash
   git commit -m 'feat: add new feature component'
   git commit -m 'feat: implement feature logic'
   git commit -m 'test: add tests for new feature'
   ```

3. Keep your branch up to date by rebasing with main
   ```bash
   # Update your local main
   git checkout main
   git pull origin main

   # Rebase your feature branch
   git checkout feature/amazing-feature
   git rebase main

   # If there are conflicts, resolve them and continue
   git rebase --continue
   ```

4. Push your branch to GitHub
   ```bash
   git push origin feature/amazing-feature
   ```

   If you've rebased your branch and get a push rejection, use force-push:
   ```bash
   git push --force-with-lease origin feature/amazing-feature
   ```
   
   > ⚠️ **Note**: Use `--force-with-lease` instead of `--force` as it's safer. It will prevent you from overwriting others' work if someone else has pushed to your branch.

### Pull Request Process
1. Create a Pull Request on GitHub
2. Ensure the PR title follows the commit convention
3. Request reviews from team members
4. Address any review comments with new commits
5. Once approved, the PR will be automatically squashed and merged
   - All commits will be combined into one
   - The PR title will be used as the final commit message
   - The commit details will include a co-authored-by credit

### GitHub Repository Settings
- Branch Protection Rules:
  - Require pull request reviews before merging
  - Require branches to be up to date
  - Squash merging enabled by default
  - Commit messages will be automatically formatted based on PR title

## 📝 Commit Convention

This project uses conventional commits specification with custom types. Your commit message should have one of the following types:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `perf:` - Performance improvements
- `test:` - Adding or modifying tests
- `build:` - Changes to build system or dependencies
- `ci:` - Changes to CI configuration files and scripts
- `chore:` - Other changes that don't modify src or test files
- `revert:` - Reverts a previous commit
- `add:` - Adding new resources or files
- `foo:` - Custom type for specific project needs

Example commit messages:
```bash
feat: add user authentication system
fix: resolve login page redirect issue
add: implement new dashboard widgets
```

## 📄 License

[MIT License](LICENSE)
