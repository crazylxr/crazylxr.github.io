var a = [
  "1. Ahmad Shadeed，主要分享CSS相关文章：https://ishadeed.com/",
  "2. Iskander Samatov，主要分享TypeScript、React相关文章：https://isamatov.com/",
  "3. Nadia Makarevich，主要分享React相关文章：https://www.developerway.com/",
  "4. 有很多优秀博主共同分享，主要分享JavaScript原理相关文章：https://blog.sessionstack.com/how-javascript-works/home",
  "5. Aleksandr Hovhannisyan，一个比较综合的博客：https://www.aleksandrhovhannisyan.com/",
  "6. Bramus Van Damme，主要分享CSS相关文章：https://www.bram.us/",
  "7. Lydia Hallie，作品集：https://www.lydiahallie.io/",
  "8. Lydia Hallie，还是这个23岁的宝藏博主写的设计模式和组件模式的书：https://www.patterns.dev/",
  "9. Huli，分享各种前端文章：https://blog.huli.tw/",
  "10. 有很多优秀博主共同分享，主要分享框架进阶的知识：https://blog.openreplay.com/",
  "11. 全网每日热门文章：https://app.daily.dev/",
  "12. 有众多博主分享前端各类文章，质量比较高：https://blog.logrocket.com/",
  "13. Dr. Axel Rauschmayer，主要分享JavaScript相关文章：https://2ality.com/index.html",
  "14. Victoria Lo，主要分享React相关文章：https://lo-victoria.com/",
  "15. 技术博主汇总平台：https://tech-blogs.dev/",
  "16. Chak Shun Yu，主要分享React相关文章，质量很高：https://www.chakshunyu.com/blog/",
  "17. Tapas Adhikary，主要分享前端开发技巧和进阶知识：https://blog.greenroots.info/",
  "18. Steven，主要分享偏基础的文章：https://lumin8media.com/",
  "19. Suhail Kakar，全栈开发，分享内容比较综合：https://blog.suhailkakar.com/",
  "20. inDepthDev，深入学习前端系列，框架相关较多：https://indepth.dev/",
  "21. 前端性能优化相关的理论：https://requestmetrics.com/web-performance/",
  "22. Alex Kondov，主要分享React文章，文章很硬核，必读：https://alexkondov.com/articles/",
  "23. JoshWComeau，主要分享CSS文章：https://www.joshwcomeau.com/",
  "24. Daily Dev Tips，日更博主，分享前端各类文章：https://daily-dev-tips.com/archive/",
  "25. Ben Nadel，全栈开发，JavaScript相关值得一看：https://www.bennadel.com/blog/complete-blog-entry-list.htm",
  "26. David Walsh，分享各类文章：https://davidwalsh.name/",
  "27. Amelia Wattenberger，分享React和可视化：https://wattenberger.com/blog",
  "28. Lee Robinson，分享React相关文章：https://leerob.io/",
  "29.Tania Rascia，分享各类文章：https://www.taniarascia.com/blog/",
  "30. Writing JavaScript，主要分享JavaScript文章：https://writingjavascript.com/",
  "31. Maxime，各类文章：https://blog.maximeheckel.com/",
  "32. Stefan，各类文章：https://www.stefanjudis.com/",
  "33. Chameera Dulanga，文章必看：https://chameeradulanga.medium.com/",
  "34. Piumi Liyana Gunawardhana，主要分享React相关文章：https://piumi-16.medium.com/",
  "35. 技术社区，内容偏向CSS，设计：https://www.smashingmagazine.com/",
  "36. 技术社区，各类前端文章，质量较高：https://blog.bitsrc.io/",
  "37. Async blog，各类前端文章：https://www.loginradius.com/blog/async/",
  "38. Stephanie Eckles，主要分享CSS文章：https://moderncss.dev/",
  "39. Devtrium，分享React、TypeScript文章：https://devtrium.com/",
  "40. ALEX DEVERO：https://blog.alexdevero.com/",
  "41. Flavio Copes：https://flaviocopes.com/",
  "42. Bhagya Vithana：https://bhagya-16.medium.com/",
  "43. Dan Abramov，React团队核心成员：https://overreacted.io/",
  "44. Todd H. Gardner，分享性能优化相关：https://toddhgardner.medium.com/",
  "45. Temani Afif，主要分享CSS相关文章：https://dev.to/afif",
  "46. Bitbucket，主要分享Git相关知识：https://www.atlassian.com/git",
  "47. Sass风格指南：https://sass-guidelin.es/zh/",
];

const b = a.map(e => {
  const info = e.slice(4)
  const name = info.split("，")[0]
  const link = info.split('：')[1]

  const douhaoi = info?.split('').findIndex(ele => ele === '，')
  const fenhaoi = info?.split('').findIndex(ele => ele === '：')

  return {
    name,
    link,
    desc: info.slice(douhaoi === -1 ? 0 : douhaoi, fenhaoi),
  };
})

console.log(b);
