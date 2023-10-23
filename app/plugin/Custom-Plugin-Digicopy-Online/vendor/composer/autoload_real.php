<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInit6fe6e82d3965301b5a2b4d4e3d25668a
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        spl_autoload_register(array('ComposerAutoloaderInit6fe6e82d3965301b5a2b4d4e3d25668a', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInit6fe6e82d3965301b5a2b4d4e3d25668a', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInit6fe6e82d3965301b5a2b4d4e3d25668a::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}