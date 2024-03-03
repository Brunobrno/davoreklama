<!DOCTYPE html>
<html lang="cz">
<head>
    <title>Davo Reklama</title>
    <?php 
    // Include common head content
    include "utilities/head.php"; 
    
    // Get the requested URL path
    $requestPath = $_SERVER['REQUEST_URI'];

    $index_css = ['css/index/index.css', 'css/index/carousel.css', 'css/index/contact.css'];
    
    // Define routes
    $routes = [
        '/' => ['css' => $index_css ], // Example of multiple CSS files
        '/index.php' => ['css' => $index_css], // Example of multiple CSS files
        '/contacts' => ['template' => 'contacts.php','css' => 'contacts.css'],
        '/about-us' => ['template' => 'about-us.php', 'css' => 'about-us.css'],
        '/reference' => ['template' => 'articles/other/reference.php', 'css' => 'reference.css'],
        '/service' => ['template' => 'articles/other/service.php', 'css' => 'service.css'],
        '/car-wrap' => ['template' => 'articles/other/car-wrap.php', 'css' => 'car-wrap.css'],
        '/graphic-design' => ['template' => 'articles/other/graphic-design.php', 'css' => 'graphic-design.css'],
        '/light-ad' => ['template' => 'articles/other/light-advertisment.php', 'css' => 'light-ad.css'],
        '/print-service' => ['template' => 'articles/other/print-service.php', 'css' => 'print-service.css'],
        '/textile-print' => ['template' => 'articles/other/textile-print.php', 'css' => 'textile-print.css'],
        '/web-design' => ['template' => 'articles/other/web-design.php', 'css' => 'web-design.css'],
    ];
    
    // Check if the requested path matches a defined route
    if (isset($routes[$requestPath])) {
        // Output the CSS files
        if (isset($routes[$requestPath]['css'])) {
            foreach ($routes[$requestPath]['css'] as $cssFile) {
                echo '<link rel="stylesheet" type="text/css" href="' . $cssFile . '">';
            }
        }

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
</head>
<body>
    <?php include "tools/nav.php"; ?>
    <main>
        <!-- Default content when no specific template is included -->
        <div class="carousel-cover-skew carousel-cover-skew-top"></div>
        <?php include "tools/index/carousel.php"; ?>
        <div class="carousel-cover-skew carousel-cover-skew-bottom"></div>
        <?php include "tools/contact.php";?>
        <?php include "tools/email-me.php";?>
        
    </main>
    <?php include "tools/footer.php"; ?>
    <?php include "tools/map.php"; ?>
</body>
</html>
