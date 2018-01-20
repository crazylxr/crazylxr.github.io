<template>
    <div id="home">
        <a class="logo" :href="logoHref"> {{ title }} </a>
        <div class="home">
            <a class="avatar" href="https://github.com/crazylxr"></a>
            <div class="link">
                <router-link to="/archive"><a href="#">归档</a></router-link>
                <router-link to="/tags"><a href="#">标签</a></router-link>
                <router-link to="/about"><a href="#">关于我</a></router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/css/home.css'
    import CONFIG from '../assets/config.js'
    
    export default {
        data() {
            return {
                logoHref: CONFIG.logoHref,
                title: CONFIG.title
            }
        }
    }
</script>
