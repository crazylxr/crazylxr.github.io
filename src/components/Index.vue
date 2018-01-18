<template>
    <div id="home">
        <a class="logo" href="https://crazylxr.github.io"> crazylxr.github.io </a>
        <div class="home">
            <a class="avatar" href="https://github.com/crazylxr"></a>
            <div class="link">
                <router-link to="/archive"><a href="#">归档</a></router-link>
                <a href="#">标签</a>
                <a href="#">关于我</a>
            </div>
        </div>
   </div>
</template>

<style>
.home {
  position: fixed;
  display: flex;
  width: 500px;
  height: 500px;
  left: 50%;
  top: 50%;
  margin-left: -250px;
  margin-top: -250px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.avatar {
  display: block;
  width: 100px;
  height: 100px;
  background: url("https://avatar.csdn.net/D/1/F/1_qq_22833925.jpg");
  background-size: 100px 100px;
  border-radius: 50px;
  background-repeat: no-repeat;
  margin: 20px;
}

.logo {
  margin-left: 100px;
}

a {
  color: #4fc08d;
}
</style>
