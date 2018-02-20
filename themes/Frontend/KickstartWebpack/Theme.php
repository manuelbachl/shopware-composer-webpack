<?php
namespace Shopware\Themes\KickstartWebpack;

use Doctrine\Common\Collections\ArrayCollection;
use Shopware\Components\Form as Form;
use Shopware\Components\Theme\ConfigSet;

define('THEMENAME', 'Kickstart Webpack');

class Theme extends \Shopware\Components\Theme
{
    /** @var string Defines the parent theme */
    protected $extend = 'Bare';

    /** @var string Defines the human readable name */
    protected $name = THEMENAME;

    /** @var string Description of the theme */
    protected $description = 'Kickstarter theme using webpack';

    /** @var string The author of the theme */
    protected $author = 'Manuel Bachl';

    /** @var string License of the theme */
    protected $license = 'MIT';

    /** @var array Discard less files from bare theme */
    protected $discardedLessThemes = [\Shopware\Themes\Bare\Theme::class];

    /** @var array Discard javascript files from bare theme */
    protected $discardedJavascriptThemes = [\Shopware\Themes\Bare\Theme::class];

    /** @var array Add custom css */
    protected $css = [
        'dist/theme.bundle.css'
    ];

    /** @var array Add custom javascript */
    protected $javascript = [
        'dist/theme.bundle.js'
    ];

    /** @var bool Prevent theme configuration from showing the parent theme configuration */
    protected $inheritanceConfig = false;

    /**
     * Create custom configuration tabs
     *
     * @param Form\Container\TabContainer $container
     */
    public function createConfig(Form\Container\TabContainer $container)
    {
        // Create the fieldset which is the container of our field
        $fieldsetGeneral = $this->createFieldSet(
            'my_custom_settings',
            'My custom settings',
            array(
                'attributes' => array(
                    'layout' => 'column',
                    'flex' => 0,
                    'defaults' => array(
                        'columnWidth' => 0.5,
                        'labelWidth' => 180,
                        'margin' => '2 15 2 0'
                    )
                )
            )
        );

        // Create the textfield
        $fontSizeField = $this->createTextField(
            'basic_font_size',
            'Basic font size',
            '16px'
        );

        // Create the color picker field
        $colorPickerField = $this->createColorPickerField(
            'custom-color-main',
            'Main color',
            '#62b74b'
        );

        // Adding the fields to the fieldset
        $fieldsetGeneral->addElement($fontSizeField);
        $fieldsetGeneral->addElement($colorPickerField);

        // Create the tab which will be named "My custom colors"
        $tabGeneral = $this->createTab(
            'kickstart_config_tab',
            THEMENAME . ' config'
        );

        // ...add the fieldset to the tab
        $tabGeneral->addElement($fieldsetGeneral);

        // ...last but not least add the tab to the container, which is a tab panel.
        $container->addTab($tabGeneral);
    }

    /**
     * Create custom configuration set
     *
     * @param ArrayCollection $collection
     */
    public function createConfigSets(ArrayCollection $collection)
    {
        $set = new ConfigSet();
        $set->setName('Basic theme');
        $set->setDescription('Use basic theme settings');
        $set->setValues(array(
            'basic_font_size' => '20px',
            'custom-color-main' => '#ff0000'
        ));

        $collection->add($set);
    }
}