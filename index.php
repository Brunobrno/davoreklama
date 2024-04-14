<!DOCTYPE html>
<html lang="cz">
<head>
    <title>Davo Reklama</title>
    <?php 
    // Include common head content
    include "utilities/head.php"; 
    
    // Get the requested URL path
    $requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    $index_css = ['css/index/index.css', 'css/index/about_us.css', 'css/index/carousel.css', 'css/index/contact.css', 'css/index/products.css', 'css/index/instagram.css','css/articles/other/reference.css' , 'css/tools/email-me.css'];
    
    // Define routes
    $routes = [
        '' => ['template' => 'articles/other/default.php', 'css' => [$index_css]], // Example of multiple CSS files
        '/' => ['template' => 'articles/other/default.php', 'css' => [$index_css]], // Example of multiple CSS files
        '/index.php' => ['template' => 'articles/other/default.php', 'css' => [$index_css]], // Example of multiple CSS files
    
        '/contacts' => ['template' => 'contacts.php','css' => ['/articles/contacts.css']],
        '/about-us' => ['template' => 'about-us.php', 'css' => ['/articles/about-us.css']],
        '/reference' => ['template' => 'articles/other/reference.php', 'css' => ['/articles/reference.css']],
        '/service' => ['template' => 'articles/service.php', 'css' => ['/articles/service.css']],
        '/car-wrap' => ['template' => 'articles/car-wrap.php', 'css' => ['/articles/car-wrap.css']],
        '/graphic-design' => ['template' => 'articles/graphic-design.php', 'css' => ['/articles/graphic-design.css']],
        '/light-ad' => ['template' => 'articles/light-advertisment.php', 'css' => ['/articles/light-ad.css']],
        '/print-service' => ['template' => 'articles/print-service.php', 'css' => ['/articles/print-service.css']],
        '/textile-print' => ['template' => 'articlestextile-print.php', 'css' => ['/articles/textile-print.css']],
        '/web-design' => ['template' => 'articles/web-design.php', 'css' => ['/articles/web-design.css']],
    ];
    
    // Check if the requested path matches a defined route
    if (isset($routes[$requestPath]) && isset($routes[$requestPath]['css'])) {
        // Output the CSS files
        foreach ($routes[$requestPath]['css'] as $cssFile) {
            if (is_array($cssFile)) {
                // If $cssFile is an array, handle it appropriately
                foreach ($cssFile as $singleCssFile) {
                    echo '<link rel="stylesheet" type="text/css" href="' . $singleCssFile . '">';
                }
            } else {
                // If $cssFile is a single CSS file, include it directly
                echo '<link rel="stylesheet" type="text/css" href="' . $cssFile . '">';
            }
        }
    }
    
    ?>
</head>
<body>
    <?php include "tools/nav.php"; ?>
    <main>
        <?php
            // Check if the requested path matches a defined route
            if (isset($routes[$requestPath])) {
                // Include the template if available
                if (isset($routes[$requestPath]['template'])) {
                    $templatePath = $routes[$requestPath]['template'];
                    if (file_exists($templatePath) && filesize($templatePath) > 0) {
                        include $templatePath;
                    }
                }
            } else {
                // If no matching route is found, include the 404 page
                include "utilities/404.php";
            }
        ?>
    </main>
    <?php include "tools/contact.php";?>
    <?php include "tools/map.php"; ?>
</body>
</html>
