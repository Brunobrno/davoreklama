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
    
        '/contacts.php' => ['template' => 'contacts.php','css' => ['/css/articles/contacts.css', '/css/articles/article-base.css']],
        '/about-us.php' => ['template' => 'articles/other/about-us.php', 'css' => ['/css/articles/other/about-us.css', '/css/articles/article-base.css']],
        '/reference.php' => ['template' => 'articles/other/reference.php', 'css' => ['/css/articles/other/reference.css', '/css/articles/article-base.css']],
        '/service.php' => ['template' => 'articles/service.php', 'css' => ['/css/articles/service.css', '/css/articles/article-base.css']],
        '/car-wrap.php' => ['template' => 'articles/car-wrap.php', 'css' => ['/css/articles/car-wrap.css', '/css/articles/article-base.css']],
        '/graphic-design.php' => ['template' => 'articles/graphic-design.php', 'css' => ['/css/articles/graphic-design.css', '/css/articles/article-base.css']],
        '/light-ad.php' => ['template' => 'articles/light-advertisment.php', 'css' => ['/css/articles/light-ad.css', '/css/articles/article-base.css']],
        '/print-service.php' => ['template' => 'articles/print-service.php', 'css' => ['/css/articles/print-service.css', '/css/articles/article-base.css']],
        '/textile-print.php' => ['template' => 'articlestextile-print.php', 'css' => ['/css/articles/textile-print.css', '/css/articles/article-base.css']],
        '/web-design.php' => ['template' => 'articles/web-design.php', 'css' => ['/css/articles/web-design.css', '/css/articles/article-base.css']],
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
        <?php include "articles/light-advertisment.php";?>
    </main>
    <?php include "tools/contact.php";?>
    <?php include "tools/map.php"; ?>
</body>
</html>