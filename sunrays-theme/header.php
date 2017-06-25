<?php print '<?xml version="1.0" encoding="utf-8"?>' ?>
<?php print '<!DOCTYPE xsl:stylesheet [ <!ENTITY nbsp "&#160;"> ]>' ?>
<?php print '<?xml-stylesheet type="text/xsl" href="/sunrays-theme/index.xsl"?>' ?> 
<?php
    $sort_data = explode(';', $_SERVER['QUERY_STRING']);

    $config = file_get_contents(__DIR__ . '/config.json');
    $config = json_decode($config, true);
    
    $theme_dir = str_replace(dirname(__DIR__), '', __DIR__);
    $theme_dir = str_replace('\\', '/', $theme_dir);
?>
<html>
<body>
<sort>
    <type><?= !empty($sort_data) ? str_replace('C=', '', $sort_data[0]) : '' ?></type>
    <direction><?= count($sort_data) > 1 ? str_replace('O=', '', $sort_data[1]) : '' ?></direction>
</sort>
<search><?= $config['search']['enabled']; ?></search>
<auto_drill_down><?= $config['autoDrillDown']; ?></auto_drill_down>
<theme_dir>"<?= $theme_dir ?>"</theme_dir>
<theme><?= $config['theme']; ?></theme>
