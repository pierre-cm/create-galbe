# create-galbe

Create and setup new [Galbe](https://galbe.dev) application.

## Usage

To setup a new Galbe application with default configuration, simply run:

```bash
bun create galbe
```

This will create a new Galbe project under `galbe-app` folder in the current directory.

To define a custom project name, you can run:

```bash$
bun create galbe my-project-name
```

This will setup a project with the default configuration.

Alternatively, you can use a different template to scaffold your project. To do that, you need to specify the `--template` option with the name of the template you want to use. Available templates are visible under the `templates` directory of this project.

```bash$
bun create galbe my-project-name --template hello
```
