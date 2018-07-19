---
layout: post
title: "UE4街头雨景效果"
description: "本篇记录了一个街头雨景的制作过程"
modified: 2018-07-19
tags: [Unreal 4, Substance Designer]
image:
  feature: /UnrealRaindrop_Title.jpg
---

最近在UE论坛里看到了这篇雨景教程，Mark一下制作过程

[原始文档地址](https://forums.unrealengine.com/community/work-in-progress/29251-koola-s-stuff/page24)

# 先看看最终的实现效果

<figure>
 <a href="/images/Raindrop.gif"><img src="/images/Raindrop.gif" alt=""></a>
 <figcaption>效果展示</figcaption>
</figure>

## 贴图

地面材质是在Substance Designer中进行制作，本篇因为重点是实现UE4中的效果，材质制作过程这里就先省略了，只是，材质在输出的时候可以参考一下原作者对贴图通道的合并，这也方便在后续UE4中进行调用

这里给出我测试时用的节点图：
<figure>
 <a href="/images/wet_graph_full.jpg"><img src="/images/wet_graph_mini.jpg" alt=""></a>
 <figcaption>Substance Designer中对原始素材进行再加工</figcaption>
</figure>

这里的重点是用「water level」节点来制作水层，用一张noise贴图与输入的高度信息进行混合后作为水体的高度信息，贴图输出的时候，除了标准的albedo和normal，其余信息都并入一张mask贴图，其中R通道为混合后的高度信息，G通道为混合后的粗糙度信息，B通道为水体与路面的分界信息，用于之后在引擎中混合法线。

雨滴在水面的波纹效果也是用Substance Designer来制作，因为Designer不支持输出动态图，所以这里实际是输出了16张帧动画之后在Photoshop中合并成一张4*4的动画图表。关于合并的技巧，最初我是手动移动图层位置进行合并，之后我发现在Photoshop「文件」→「自动」→「联系表」功能中，就可以自动按照序号对多张图片进行合并。

<figure>
 <a href="/images/water_normal.jpg"><img src="/images/water_normal.jpg" alt=""></a>
 <figcaption>导出的其中一张法线贴图</figcaption>
</figure>

## 材质

在制作地面材质的时候，法线需要用之前mask的B通道对地面法线与波纹法线再次混合后输出。

<figure>
 <a href="/images/wet_material_full.jpg"><img src="/images/wet_material_mini.jpg" alt=""></a>
 <figcaption>地面材质network</figcaption>
</figure>

然后是雨滴材质，这个就是因人而异了，这里给出原作者的做法：

<figure>
 <a href="/images/raindrop_material_full.jpg"><img src="/images/raindrop_material_mini.jpg" alt=""></a>
 <figcaption>雨滴材质network</figcaption>
</figure>

其中用到的法线贴图可以在引擎内容中找到，路径为
>/Engine/Functions/Engine_MaterialFunctions02/ExampleContent/Textures/SphereRenderNormalsMap

## 场景

这次的场景非常简单，只用到了一个Box和两个Plane,光源也只是使用了模型自发光，注意要勾选「Lighting」-「Lightmass Settings」-「Use Emissive for Static Lighting」来启用模型光源实际发射光线。

同时场景内还用到了BoxReflectionCapture进行反射捕捉，ExponentialHeightFog来增加一些体积感，PostProcessVolume进行后期处理。

<figure>
 <a href="/images/0719_env.jpg"><img src="/images/0719_env.jpg" alt=""></a>
 <figcaption>场景十分简单</figcaption>
</figure>

## 粒子

最后就是制作雨滴粒子效果，这个也是看个人喜好，这里给出一个快速的实现效果：

因为雨滴通常需要很大的粒子数量才能正常模拟，然而默认的cpu渲染粒子明显会受到性能限制，这里给粒子添加GPU Sprites数据类型让粒子转换成GPU渲染

<figure>
 <a href="/images/0719_particle_outline.jpg"><img src="/images/0719_particle_outline.jpg" alt=""></a>
 <figcaption>雨滴粒子</figcaption>
</figure>

然后把材质模型粒子组合，voila

<figure>
 <a href="/images/Raindrop2.gif"><img src="/images/Raindrop2.gif" alt=""></a>
 <figcaption>效果展示</figcaption>
</figure>