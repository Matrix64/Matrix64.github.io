---
layout: post
title: "UE4建筑效果视觉表现——木屋"
description: "本篇记录了一个照片场景的还原过程"
modified: 2018-07-26
tags: [Maya ,Unreal 4, Arch]
image:
  feature: /0726_UnrealArchReinaldo_Title.jpg
---

自从我开始接触UE4，就被这一点都不虚幻的写实效果震撼到了，在花了半年的时间摸索之后，现在对建筑效果视觉表现的制作流程有了一点心得。

<figure>
 <a href="/images/0726_UnrealArchReinaldo_01_full.jpg"><img src="/images/0726_UnrealArchReinaldo_01_mini.jpg" alt=""></a>
 <figcaption>效果展示01</figcaption>
</figure>

<figure>
 <a href="/images/0726_UnrealArchReinaldo_03_full.jpg"><img src="/images/0726_UnrealArchReinaldo_03_mini.jpg" alt=""></a>
 <figcaption>效果展示02</figcaption>
</figure>

这个场景的灵感来自于[Reinaldo Kevin](https://unsplash.com/photos/FZaBLAEyIZY)拍摄的照片：

<figure>
 <a href="/images/0726_UnrealArchReinaldo_02_full.jpg"><img src="/images/0726_UnrealArchReinaldo_02_mini.jpg" alt=""></a>
 <figcaption>Coffee Shop photo by Reinaldo Kevin</figcaption>
</figure>

## 建模

<figure>
 <a href="/images/0726_UnrealArchReinaldo_04_full.jpg"><img src="/images/0726_UnrealArchReinaldo_04_mini.jpg" alt=""></a>
 <figcaption>maya</figcaption>
</figure>

场景搭建我是在Maya中完成的，总体原则是，不存在彻底的硬边，也就是尽量使用Bevel处理边缘，整个场景的制作时间大概是2天，关于光照贴图的处理，虽然UE4已经可以很方便的自动生成光照UV，但是我还是习惯于手动制作，方便调整。

## 场景&灯光

因为这次的场景总体是方形区域，使用的也是盒体反射捕捉。从照片上来看，场景整体没有明显光影变化，所以整个场景我**只使用了一个SkyLight**进行照亮

<figure>
<img src="/images/0726_UnrealArchReinaldo_05_mini.jpg" alt="">
 <figcaption>SkyLight参数</figcaption>
</figure>

这次正巧用的是Unreal 4.20.0版本进行制作，这次版本更新了一个新的RectLight,用法和PointLight类似，自带矩形形状，刚好可以用来做墙后灯

<figure>
 <a href="/images/0726_UnrealArchReinaldo_06_full.jpg"><img src="/images/0726_UnrealArchReinaldo_06_mini.jpg" alt=""></a>
 <figcaption>新的RectLight</figcaption>
</figure>

## Lightmass

因为主要靠SkyLight来照亮场景，我把SkyLightingBounces设置到了50

<figure>
<img src="/images/0726_UnrealArchReinaldo_07_mini.jpg" alt="">
 <figcaption>Lightmass参数</figcaption>
</figure>

## 镜面效果

在以前的版本，想要做镜面效果，大多是直接使用一个纯白纯金属度完全光滑的材质球来实现，或者利用RenderTexture配合Scene Capture Cube对场景进行抓取实现。但是前者在反射效果上一直都很难令人满意，后者虽然可以实现类似镜面的效果，但是缩放比例不对，任旧需要额外制作蓝图进行效果修正。这里我使用的是新的第三种方法，**PlanarReflection**。

<figure>
 <a href="/images/0726_UnrealArchReinaldo_08_full.jpg"><img src="/images/0726_UnrealArchReinaldo_08_mini.jpg" alt=""></a>
 <figcaption>PlanarReflection实现的镜面效果</figcaption>
</figure>

在使用PlanarReflection之前，要先在项目设置-Rendering-Lighting菜单种激活「Support global clip plane for Planar Reflections」,之后引擎会提示需要重启项目才能完成激活。激活这个选项之后，会使得三角面的渲染消耗增加大约15%，这次的场景因为十分简单，这种消耗可以忽略。

然后给真正的镜面物体赋予之前提到的三个方法中第一个的反射材质球。这时得到的反射效果是错误的，然后放置PlanarReflection在镜面物体正前方，**旋转至与镜面反射方向一致**，调整至合适的尺寸，用PlanarReflection来获取正确的反射结果，然后传达给镜面物体，从而实现我们想要的镜面效果。

## 调色

关于PostProcessVolume的用法，这个其实才是最灵活的，这里提下官方推荐的LUT制作方法，LUT也就是Lookup Table，可以简单理解成相机滤镜，Unreal官方给出了一个[LUT制作流程](https://docs.unrealengine.com/en-us/Engine/Rendering/PostProcessEffects/UsingLUTs)方便大家使用，我也是参考了这个流程做了一个查找表。

## 总结

这次的练习中其实还有很多内容我没有去进一步测试，比如不同灯光的搭配组合来营造不同氛围，这些都需要继续花时间不断尝试、感受之后才能积累到更多经验，我想我之后也会继续花时间尝试其他效果吧。

<figure>
 <a href="/images/0726_UnrealArchReinaldo_09_full.jpg"><img src="/images/0726_UnrealArchReinaldo_09_mini.jpg" alt=""></a>
 <figcaption></figcaption>
</figure>