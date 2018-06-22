---
layout: post
title: "Unite Tokyo 2018 笔记 [1-2]"
description: "记录Unite 2018 关于RealtimeToonShader方面内容"
modified: 2018-06-20
tags: [Unite Tokyo 2018, Unity, Shader, 笔记]
image:
  feature: unite\toonShader\cover.jpg
---

# 【Unite Tokyo 2018】ToonShader对话环节#1『RealtimeToonShader彻谈』Part2

Unity3D Japan在今年5月8日的Unite Tokyo 2018大会上有一个关于实时卡通渲染Shader的技术解析，这里做一些关键词笔记。

因为原视频总时长有2小时以上，这里我打算分成几个部分进行记录。

🎞油管视频地址：[【Unite Tokyo 2018】トゥーンシェーダートークセッション#1『リアルタイムトゥーンシェーダー徹底トーク』](https://www.youtube.com/watch?v=gi4XO0WiRcM&t)

Part1：[【Unite Tokyo 2018】ToonShader对话环节#1『RealtimeToonShader彻谈』Part1](https://matrix64.github.io/Unite18ToonShader_p1-post/)

---

## ✯ToonShader设计时的要点·续

### 6.「不能过度依赖贴图信息」

原因有以下几点：

- 因为贴图的分辨率有限，拿来做参数使用的时候经常会得不到满意的效果

- 在由纯粹明暗控制阴影的CelShader中，稍微有一点锯齿都会变得很明显。灰度也只有256阶。难以压缩

- 也是因为如此，难以使用法线贴图

- 因为顶点法线与顶点色不会受分辨率影响所以锯齿感会弱很多

- 不知道还会不会出现新的解决方案？

除了上面提到的这几点外，在UV处理的过程中也要通过尽量保持水平垂直的UV边界来避免锯齿感。

<figure>
	<a href="/images/unite/toonShader/LessTex.jpg"><img src="/images/unite/toonShader/LessTex.jpg" alt=""></a>
	<figcaption>GGXrd的贴图展示</figcaption>
</figure>

## ✯在与模型组工作人员的配合过程中遇到的事情

### 制作DCC插件方便生产

在游戏开发的过程中，程序开发完成shader之后，美术人员就要配合shader来调整UV，制作贴图，这个过程中如果能有一些针对性强的插件来制作，就可以更快的完成整个项目。比如顶点色编辑工具，法线编辑工具等等。我自己也会用一些Photoshop的插件来方便贴图的制作与打包导出等等。

### 指导模型制作规范与传达Shader的原理

- 因为Shader与模型是配合工作的，所以介绍的时候也需要一起介绍

- 因为建模人员补充的越来越少，到后来几乎都变成一对一的讲解了

- 就是因为一对一的讲解，没有留下文档化的资料，这里需要反省

- 在讲解的过程中又会有各种新功能的追加与变更，每次都要重新再说明，不过这也因为是小团队才能这么做

- 同时也会举办shader学习会，所以多半的模型师都会自己设计shader

### 与外部技术团队合作进行插件开发

京野氏当初与外部公司合作开发了法线编辑工具，也是为了方便后续的贴图制作流程。

这里提到了一个Unity端法线编辑插件“NormalPainter”,对应系统是Unity 2017.1以上可用。功能包括：

- 顶点、法线、切线等的可视化

- 法线绘制、旋转、缩放等

- 根据选择范围进行遮罩

- 法线镜像

- 法线转移

- 从顶点按照法线方向发射射线，选取碰到指定物体部分的法线

- 导入/导出

- 法线<--->顶点色的相互转换

- 将法线导出成贴图

- 将法线贴图导入成顶点法线

- 导出obj格式文件

- 如果使用FbxExporter也能导出fbx格式

<figure>
	<a href="https://user-images.githubusercontent.com/1488611/27468607-b3e9e4d0-5825-11e7-954d-fca1a7a50417.gif"><img src="https://user-images.githubusercontent.com/1488611/27468607-b3e9e4d0-5825-11e7-954d-fca1a7a50417.gif" alt=""></a>
	<figcaption>NormalPainter用法演示</figcaption>
</figure>

因为不想让插件被限定成公司内部使用，京野氏以个人名义拜托了插件的作者GOTETZ氏之后，得以开源。要感谢京野氏以及插件作者GOTETZ氏！
GitHub地址是：https://github.com/unity3d-jp/NormalPainter

而且其实GOTETZ也有美术方面功底，参与制作了罪恶装备的登场角色模型制作。

### 「shadow」与「shade」的相关处理

这里先给出一张示意图

<figure>
	<a href="/images/unite/toonShader/shadow.jpg"><img src="/images/unite/toonShader/shadow.jpg" alt=""></a>
	<figcaption>光影示意图</figcaption>
</figure>

其中金色的部分标出的是由光源方向与shader进行主要控制的区域，蓝色部分为GI(Global Illumination)影响较大的区域，绿色部分是CastShadow代码控制的区域，红色部分是由后期特效影响的区域。

在卡通渲染过程中，有一些阴影的作用是为了凸显形状(フォルム)，这些大多是自身阴影，用角色举例就是出现在手臂下方或者衣服褶皱的部分的阴影。比如为了强调手臂的圆柱体的形状而产生的阴影。

<figure>
	<a href="/images/unite/toonShader/shade.jpg"><img src="/images/unite/toonShader/shade.jpg" alt=""></a>
	<figcaption>光影示意图</figcaption>
</figure>

不过，在手绘动漫的流程中，自身阴影一般只会在需要的时候才会存在，其他情况下应该避免自身阴影的出现。

为了方便控制角色面部的投影，可以通过灯光排除来设置只影响面部的灯光和用于面部以外的灯光

<figure>
	<a href="/images/unite/toonShader/twoLight.jpg"><img src="/images/unite/toonShader/twoLight.jpg" alt=""></a>
	<figcaption>两种不同用途的灯光</figcaption>
</figure>

如果灯光本身任旧难以表现出想要的阴影，可以尝试用一块勾选ShadowOnly的面片来产生阴影

<figure>
	<a href="/images/unite/toonShader/ShadowPlane.jpg"><img src="/images/unite/toonShader/ShadowPlane.jpg" alt=""></a>
	<figcaption>两种不同用途的灯光</figcaption>
</figure>

这里小林氏再次提到了崩坏3在阴影表现中也是通过贴图来控制具体哪里需要阴影，哪里不需要。

最后来总结一下投影相关的要点：

#### 「shadow」与「shade」

- shadows是由光源与物体交互产生，shade是由法线与光源的点积计算而来的

- 不过这是在只有一个平行光源前提下得出的结论。真正的结果应该是将周围所有的光照按照积分求和方式累加在一起才对

- 不过现在也有除了shadow与shade之外，也要同时考虑AmbientOcclusion的想法

- 在动画中会有动画师完全不管上面的结论而特别对阴影位置进行指定的情况出现

- 在GGXrd中为了实现这种特定位置投影的效果，使用了顶点色、顶点法线与贴图进行同步调整

#### 为了什么进行阴影设计？

- 在动画中出现的阴影不全是为了表面**正确性**，大多数情况下是因为有**想要传达的内容**

- 所以阴影是有动画师进行**设计**，进行形状的传达

- 所以仅仅通过**计算**是没办法获得好的画面的。**好的画面 = 有所表达的画面**

#### 投影色的考量

- 投影色 = 为了表达素材质感的信息

- 环境光 + 表面散射以及通透率决定了投影的颜色。比如：蓝色的天空 + 红色的血液 = 偏紫色的投影

- 物体密度低 = 通透率高 = 投影颜色明亮 = 柔和、稀薄、脆弱的印象     反之同理

#### 2号阴影的考量

- 原本在动画制作过程中，2号阴影大多被作为AO来使用。用来表达“阴影中更深层的部分”的效果

- 所以，并不是“与光线方向相反的区域”。

- 这与法线和光线方向点积的结果无关。是否被周围环境遮蔽 = 一种体积感的表现手法

#### Toon 与 SelfShadow 共存很难

- 如果不在ToonShader里结合shadowMap的话很难产生想要的形状（有可能会出现多重阴影，阴影太黑等情况）

- 在GGXRD中因为shader制作过程中没有加入考虑shadow Map，而是通过顶点色与顶点法线来解决投影问题

- Unity中虽然整合了两者，但是……

- 只能在十分特殊的情况下才能制作出满意的效果(比如从十分贴近正面的角度进行打光)

- 而且还会受到分辨率、深度、距离、角度等的限制，这方面还有很多难题需要解决，不仅限于ToonShader。

#### 而且说到底 shadowMap 的想法与动漫中阴影的绘制方法其实不一致

- shadowMap 是**从光源产生的投影**

- 动漫风格的阴影是**相对于环境的遮蔽**。是包括AO在内**符号化**的产物

- 如果硬要用shadowMap来产生阴影的话，来自头顶的光源就会让角色的脸部全被阴影覆盖

- 在动漫中的话，如果主光源在正上方，那角色头发的投影也大多会被符号化处理。当然这也要看情况。

- 所以只靠一张shadowMap很难表现各种情况下的光源投影结果。

#### 现阶段的解决方案

- 分别使用两张shadowMap来控制角色与背景<sup>[1]</sup>

- 让角色的自身阴影主要由摄影机一盏正面方向的光源来产生。看起来会更稳定一些

- 不过这样的话，角色在地面的投影以及背景的投影等都会因此而被拉伸

- 所以背景可以用其他灯光来产生阴影。

[1]：关于多重shadowMap的使用案例，可以参考2015年的一片UnityBlog：[「Unique Character Shadows in The Blacksmith」](https://blogs.unity3d.com/cn/2015/05/28/unique-character-shadows-in-the-blacksmith/)  
  
文章中涉及到了当场景与角色的尺寸差距很大的时候，为了保证场景投影信息正确而调节直射光投影角度之后，导致角色身上的投影锯齿明显的情况。  

关于Unity直射光投影的信息可以参考官方手册：[「Directional light shadows」](https://docs.unity3d.com/Manual/DirLightShadows.html)

#### 将来的发展

- 打算将AO直接整合到ToonShader中，不过以现阶段的技术还有些难度

- SSAO的质感与卡通渲染质感匹配度太低。

# つづく