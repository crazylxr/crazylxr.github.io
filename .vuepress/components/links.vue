<template>
  <h2>国外博主</h2>
  <div class="link-list">
    <div class="link-item" v-for="(item, index) in linkData" v-bind:key="index">
      <a v-bind:href="item.link" target="_blank">
        <span class="avatar">
          <img v-bind:src="item.avatar || 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi.qqkou.com%2Fi%2F0a1406481394x2846025398b26.jpg&refer=http%3A%2F%2Fi.qqkou.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1649860004&t=6ad666de54102c2358ca1e557d2b67be'" alt="Error" />
        </span>
        <span class="link-info"
          ><span class="text-ellipsis"> {{ item.name }}</span>
          <small class="text-ellipsis">{{ item.desc }}</small>
        </span>
      </a>
    </div>
  </div>
</template>

<script>
import linkData from "../data/links";

export default {
  data() {
    return {
      linkData,
    };
  },
};
</script>

<style scoped>
.link-list {
  display: grid;
  grid-template-columns: 450px 450px;
  grid-template-rows: 100px 100px;
}

.link-item {
  width: 400px;
  height: 100px;
}
.link-item img {
  width: 40px;
  height: 40px;
  border-radius: 3px;
}

.link-item a {
  display: flex;
  box-shadow: 0 2px 6px rgb(0 0 0 / 10%);
  padding: 15px;
}

.link-item .link-info {
  margin-left: 15px;
  max-width: 300px;
}

.text-ellipsis {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #555;
}

.text-muted {
  color: #a0a0a0;
}
</style>