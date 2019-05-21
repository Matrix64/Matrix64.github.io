---
layout: post
title: "WorldNormalVector"
description: "本篇记录了UnitySurfaceShader中修改Normal节点后的注意事项"
modified: 2019-05-20
tags: [Unity, Surface Shader]
image:
  feature: /CheapSS/title.jpg
---

# 今天的主角是Surface Shader

平时我主要用vertex fragment shader进行效果开发,对surface shader接触的相对就少一些.不过项目中总会遇到有用surfaceShader开发的插件,在对插件进行修改和优化的过程中,我就遇到了这个有意思的问题.

<figure class="large">
    <div class="myvideo">
       <video  style="display:block; width:100%; height:auto;" autoplay controls loop="loop">
           <source src="/images/CheapSS/output.mp4" type="video/mp4" />
       </video>
    </div>
<figcaption>A nice movie format</figcaption>
</figure>
