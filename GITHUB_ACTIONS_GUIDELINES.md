# GitHub Actions Workflows Documentation

This directory contains a comprehensive set of GitHub Actions workflows for automated CI/CD, testing, security, and project management.

## 📋 Workflow Overview

### Core CI/CD Workflows

| Workflow | File | Purpose | Triggers |
|----------|------|---------|----------|
| **Main CI/CD** | `ci-cd.yml` | Complete CI/CD pipeline with testing, building, and deployment | Push/PR to master, staging, develop |
| **PR Validation** | `pr-validation.yml` | Comprehensive PR checks and automated code review | PR opened/updated |
| **Release Automation** | `release.yml` | Automated release process with versioning and deployment | Tags, manual trigger |

### Quality & Security Workflows

| Workflow | File | Purpose | Triggers |
|----------|------|---------|----------|
| **Dependency Updates** | `dependency-updates.yml` | Automated dependency management and security audits | Weekly schedule, manual |
| **Performance Monitoring** | `performance-monitoring.yml` | Bundle size, memory, and performance analysis | Daily schedule, code changes |
| **Project Automation** | `project-automation.yml` | Label management, stale cleanup, project board automation | Issues/PRs, weekly schedule |

## 🚀 Getting Started

### Prerequisites

1. **Repository Secrets**: Configure the following secrets in your repository settings:

```bash
# Android Release Signing (Optional)
ANDROID_KEYSTORE_BASE64      # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD    # Keystore password
ANDROID_KEY_ALIAS           # Key alias name
ANDROID_KEY_PASSWORD        # Key password

# iOS Release Signing (Optional)
IOS_CERTIFICATE_BASE64      # Base64 encoded p12 certificate
IOS_CERTIFICATE_PASSWORD   # Certificate password
IOS_PROVISIONING_PROFILE_BASE64  # Base64 encoded provisioning profile

# App Store Deployment (Optional)
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON  # Google Play service account JSON
APP_STORE_CONNECT_API_KEY        # App Store Connect API key

# Notifications (Optional)
SLACK_WEBHOOK_URL           # Slack webhook for notifications
SEMGREP_APP_TOKEN          # Semgrep security scanning token
```

2. **Branch Protection**: Set up branch protection rules for `master`, `staging`, and `develop` branches.

3. **Repository Labels**: Run the label setup workflow to create standardized labels.

### Initial Setup

1. **Setup Labels**:
   ```bash
   # Go to Actions tab → Project Automation & Labels → Run workflow
   # Select "setup-labels" action
   ```

2. **Configure Branch Strategy**:
   ```
   master   → Production releases
   staging  → Staging deployments  
   develop  → Development integration
   ```

3. **First Release**:
   ```bash
   # Create a release tag
   git tag v1.0.0
   git push origin v1.0.0
   ```

## 📊 Workflow Details

### 1. Main CI/CD Pipeline (`ci-cd.yml`)

**Triggers**: Push/PR to main branches, manual dispatch

**Jobs**:
- **Code Quality**: ESLint, TypeScript checking, formatting
- **Testing**: Unit tests with coverage reporting
- **Security**: Vulnerability scanning, dependency audit
- **Build Android**: APK and AAB generation
- **Build iOS**: Archive creation (macOS runner)
- **Deploy**: Environment-specific deployments

**Features**:
- ✅ Parallel job execution for speed
- ✅ Artifact uploading and management  
- ✅ Environment-specific configurations
- ✅ Automatic failure notifications
- ✅ Cache optimization for dependencies

### 2. PR Validation (`pr-validation.yml`)

**Triggers**: PR opened, synchronized, ready for review

**Jobs**:
- **PR Format Validation**: Semantic PR titles, description checks
- **Automated Code Review**: ESLint + TypeScript with reviewdog
- **Bundle Size Analysis**: Size tracking and warnings
- **Security Scanning**: Trivy + Semgrep analysis
- **Performance Testing**: Memory leaks, startup performance
- **Auto-assignment**: Reviewers and labels based on changes

**Features**:
- ✅ Semantic PR title enforcement
- ✅ Automated reviewer assignment
- ✅ Bundle size comparison with base branch
- ✅ Security vulnerability detection
- ✅ Performance regression detection

### 3. Release Automation (`release.yml`)

**Triggers**: Version tags (v*.*.*), manual workflow dispatch

**Jobs**:
- **Version Validation**: Semantic version checking
- **Release Testing**: Full test suite execution
- **Multi-platform Builds**: Android + iOS artifacts
- **GitHub Release**: Automated changelog generation
- **Asset Upload**: APK, AAB, and archive files
- **Store Deployment**: Google Play + App Store (optional)
- **Notifications**: Slack alerts and deployment issues

**Features**:
- ✅ Semantic versioning validation
- ✅ Automated changelog generation
- ✅ Multi-platform release artifacts
- ✅ Store deployment automation
- ✅ Post-release notification system

### 4. Dependency Management (`dependency-updates.yml`)

**Triggers**: Weekly schedule (Mondays 9 AM UTC), manual dispatch

**Jobs**:
- **Security Audit**: Vulnerability scanning with yarn audit
- **Dependency Analysis**: Outdated package detection
- **Automated Updates**: Security/patch/minor/major updates
- **License Compliance**: License compatibility checking
- **Dashboard Updates**: Dependency status tracking

**Features**:
- ✅ Automated security vulnerability fixes
- ✅ Configurable update strategies
- ✅ License compliance monitoring
- ✅ Automated PR creation for updates
- ✅ Dependency dashboard maintenance

### 5. Performance Monitoring (`performance-monitoring.yml`)

**Triggers**: Daily schedule, code changes, manual dispatch

**Jobs**:
- **Bundle Analysis**: Size tracking and optimization recommendations
- **Memory Analysis**: Memory leak detection patterns
- **Startup Performance**: Import analysis and loading optimization
- **Network Performance**: API usage pattern analysis
- **Health Reporting**: Overall application health scoring

**Features**:
- ✅ Bundle size tracking and alerts
- ✅ Memory leak pattern detection
- ✅ Performance regression detection
- ✅ Optimization recommendations
- ✅ Health score calculation

### 6. Project Automation (`project-automation.yml`)

**Triggers**: Issues/PRs lifecycle, weekly cleanup, manual dispatch

**Jobs**:
- **Label Management**: Standard label creation and maintenance
- **Auto-labeling**: Content-based automatic labeling
- **Stale Management**: Automated stale issue/PR cleanup
- **Project Board**: Automated project management
- **Health Monitoring**: Repository health tracking

**Features**:
- ✅ Comprehensive label system
- ✅ Intelligent auto-labeling
- ✅ Stale content management
- ✅ Automated project organization
- ✅ Repository health monitoring

## 🏷️ Label System

### Priority Labels
- `priority/critical` - Critical priority
- `priority/high` - High priority  
- `priority/medium` - Medium priority
- `priority/low` - Low priority

### Type Labels
- `type/bug` - Bug fixes
- `type/feature` - New features
- `type/enhancement` - Improvements
- `type/documentation` - Documentation
- `type/refactor` - Code refactoring
- `type/performance` - Performance related

### Status Labels
- `status/in-progress` - Work in progress
- `status/blocked` - Blocked by dependencies
- `status/ready-for-review` - Ready for review
- `status/needs-info` - More information needed

### Platform Labels
- `platform/android` - Android specific
- `platform/ios` - iOS specific
- `platform/both` - Both platforms

### Component Labels
- `component/ui` - User interface
- `component/api` - API related
- `component/auth` - Authentication
- `component/navigation` - Navigation
- `component/database` - Database/storage

## 🔧 Configuration Guide

### Environment Variables

```yaml
# Node.js version (consistent across all workflows)
NODE_VERSION: '18'

# Java version for Android builds
JAVA_VERSION: '17'

# Ruby version for iOS builds (macOS)
RUBY_VERSION: '3.0'
```

### Branch Strategy

```yaml
# Production branch - requires all checks
master:
  - protection: required
  - checks: all workflows must pass
  - reviews: 2 required

# Staging branch - staging deployments
staging:  
  - protection: required
  - checks: CI/CD must pass
  - reviews: 1 required

# Development branch - integration testing
develop:
  - protection: optional
  - checks: basic validation
  - reviews: optional for small changes
```

### Workflow Customization

#### Modify Update Schedule
```yaml
# In dependency-updates.yml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
```

#### Customize Performance Thresholds
```yaml
# In performance-monitoring.yml
bundle_size_warning: 15MB
bundle_size_critical: 20MB
memory_leak_threshold: 10MB
```

#### Configure Stale Management
```yaml
# In project-automation.yml
days-before-stale: 30
days-before-close: 7
exempt-labels: 'priority/critical,priority/high,status/in-progress'
```

## 📈 Monitoring & Dashboards

### Workflow Status
- **GitHub Actions Tab**: Real-time workflow status
- **Repository Insights**: Workflow performance metrics
- **Dependency Dashboard**: Issue-based dependency tracking
- **Health Dashboard**: Repository health monitoring

### Notifications
- **Slack Integration**: Workflow status and alerts
- **GitHub Issues**: Automated issue creation for problems
- **Email Notifications**: GitHub's built-in notification system

### Artifacts
- **Build Artifacts**: APK, AAB, and archive files
- **Test Reports**: Coverage and performance reports
- **Security Reports**: Vulnerability and compliance reports
- **Performance Reports**: Bundle size and memory analysis

## 🛠️ Troubleshooting

### Common Issues

1. **Workflow Permissions**:
   ```yaml
   permissions:
     contents: read
     pull-requests: write
     issues: write
     checks: write
   ```

2. **Node.js Cache Issues**:
   ```bash
   # Clear workflow cache
   Actions → Caches → Delete yarn cache
   ```

3. **Android Build Failures**:
   ```bash
   # Check Java version and Android SDK setup
   # Verify keystore configuration
   ```

4. **iOS Build Failures**:
   ```bash
   # Verify certificate and provisioning profile
   # Check Xcode version compatibility
   ```

### Debug Mode

Enable debug logging by setting repository secret:
```bash
ACTIONS_STEP_DEBUG=true
ACTIONS_RUNNER_DEBUG=true
```

### Workflow Dispatch

All workflows support manual triggering:
1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Configure parameters as needed

## 🚀 Best Practices

### Development Workflow

1. **Feature Development**:
   ```bash
   feature/description → develop → staging → master
   ```

2. **Hotfix Process**:
   ```bash
   hotfix/description → master (direct) + cherry-pick to develop
   ```

3. **Release Process**:
   ```bash
   develop → staging → master → tag release
   ```

### Code Quality

- ✅ Always run `yarn type-check` before pushing
- ✅ Use `yarn lint --fix` to fix linting issues
- ✅ Write tests for new features (`yarn test`)
- ✅ Keep bundle size under 15MB
- ✅ Follow semantic commit conventions

### Security

- ✅ Regularly update dependencies (`yarn upgrade`)
- ✅ Monitor security alerts in GitHub
- ✅ Review dependency licenses
- ✅ Use secrets for sensitive data
- ✅ Enable branch protection rules

## 📞 Support

### Getting Help

1. **Workflow Issues**: Check Actions tab for detailed logs
2. **Configuration Questions**: Review this documentation
3. **Bug Reports**: Create issue with `type/bug` label
4. **Feature Requests**: Create issue with `type/feature` label

### Useful Commands

```bash
# Local development
yarn install          # Install dependencies
yarn type-check       # Type checking
yarn lint             # Linting
yarn test             # Run tests
yarn test:ci          # CI test mode

# Workflow testing
act                   # Run workflows locally (requires act CLI)
yarn build            # Test build process

# Release preparation
yarn version patch    # Bump patch version
yarn version minor    # Bump minor version
yarn version major    # Bump major version
```

---

*This documentation is automatically maintained. Last updated: $(date)*
