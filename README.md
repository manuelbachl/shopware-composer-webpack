# Shopware 5 boilerplate using composer and webpack

[manuelbachl/shopware-composer-webpack](https://github.com/manuelbachl/shopware-composer-webpack)

## Installation

```bash
git clone git@github.com:manuelbachl/shopware-composer-webpack.git my-project
```

This will clone the repository into a new directory `my-project`.

Define your project settings in `.env` file:

```bash
cd my-project
cp .env.example .env
```

Run the installer:

```bash
./app/install.sh
```

**Hint:** If you receive the error message `WARNING! SQLSTATE[42S02]: Base table or view not found: 1146 Table 'shopware.s_core_plugins' doesn't exist in /shared/httpd/shopware/vendor/shopware/shopware/engine/Shopware/Bundle/PluginInstallerBundle/Service/PluginInitializer.php` and th einstaller aborts, just run `composer update` and ignore the errors and warnings in order to get the installer to work. 

Enabling site:

maybe it is necessary (depending on your server config) to symlink index.php to shopware.php:

```bash
ln -s ./shopware.php ./index.php
```

## Using shopware cli

The shopware cli-tool is getting installed during initial install. To use it just call

```bash
php bin/console 
```

Refer to this page to get some useful information: [Shopware docs (GER)](http://community.shopware.com/Shopware-CLI-Nuetzliche-Befehle--Tricks_detail_1990_795.html)



## Useful links
* [shopware/composer-project](https://github.com/shopware/composer-project)
