<script lang="ts">
    let menuItem = [
        { name: "Home", url: "/" },
        { name: "Explore", url: "/explore"},
        { name: "About", url: "/about" }
    ]
</script>

<div class="landing-page-container">
    <!-- navbar -->
    <nav>
        <!-- menu -->
        <div class="menu-container">
            {#each menuItem as item (item.name)}
                <a href={item.url}>
                    <button>{item.name}</button>
                </a>
            {/each}
        </div>
        
        <!-- logo -->
        <div class="logo-container"></div>

        <!-- actions -->
        <div class="actions-container"></div>
    </nav>

    <!-- hero -->
    <section class="hero"></section>

    <!-- featured category -->
    <section class="featured-category"></section>

    <!-- featured products -->
    <section class="featured-product"></section>

    <!-- footer -->
    <footer></footer>
</div>

<style>
    .landing-page-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    /* nav styles */
    nav {
        display: flex;
        justify-content: space-between;
        border: 1px solid black;
        height: 50px;
    }
    .menu-container {
        display: flex;
        gap: 0.5rem;
    }
</style>