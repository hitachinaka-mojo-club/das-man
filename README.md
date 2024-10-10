<!-- markdownlint-disable MD024 -->

# das man 🤖 🍼

das man is an interface for *naive existence*.

## Setup with Dev Containers 📦

You can easily launch the development environment of das-man with Dev Containers.  
Here is the step-by-step guide.

### Attention

- You need to install [Docker](https://docs.docker.com/get-docker) and [VSCode](https://code.visualstudio.com) before.

### 1. clone git repository

```bash
git clone "https://github.com/hitachinaka-mojo-club/das-man" && cd "./das-man"
```

### 2. set environment variables

See `.env.example` or contact the [repository owner](https://github.com/dino3616) for more details.

### 3. launch dev containers

Launch containers using the VSCode extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

### 4. start development server

```bash
bun dev
```

## Setup locally 🖥️

If you want to build an environment more quickly without Docker, you can follow these steps to build your environment locally.

### Attention

- You need to install [proto](https://moonrepo.dev/docs/proto/install) (optional) before.
- You need to install [bun](https://bun.sh) that specified in [`.prototools`](./.prototools) before. (With proto, you can easily install a specified version of the tool. Recommendation.)
- [Optional] You should install project recommended VSCode extensions that specified in [`.devcontainer/devcontainer.json`](./.devcontainer/devcontainer.json#L9C9-L13C26) before.

### 1. clone git repository

```bash
git clone "https://github.com/hitachinaka-mojo-club/das-man" && cd "./das-man"
```

### 2. set environment variables

See `.env.example` or contact the [repository owner](https://github.com/dino3616) for more details.

### 3. setup build tools

```bash
proto use
```

### 4. install dependencies

```bash
bun install
```

### 5. start development server

```bash
bun dev
```
