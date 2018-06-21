---
layout: post
title: "Unite Tokyo 2018 笔记[1]"
description: "记录Unite 2018 关于RealtimeToonShader方面内容"
modified: 2018-06-20
tags: [Unite Tokyo 2018, Unity, Shader, 笔记]
image:
  feature: unite\toonShader\cover.jpg
---


# 【Unite Tokyo 2018】ToonShader对话环节#1『RealtimeToonShader彻谈』Part1

Unity3D Japan在今年5月8日的Unite Tokyo 2018大会上有一个关于实时卡通渲染Shader的技术解析，这里做一些关键词笔记。

因为原视频总时长有2小时以上，这里我打算分成几个部分进行记录。

🎞油管视频地址：[【Unite Tokyo 2018】トゥーンシェーダートークセッション#1『リアルタイムトゥーンシェーダー徹底トーク』](https://www.youtube.com/watch?v=gi4XO0WiRcM&t)

Part2：[【Unite Tokyo 2018】ToonShader对话环节#1『RealtimeToonShader彻谈』Part2](https://matrix64.github.io/Unite18ToonShader_p2-post/)

---

## ✯主讲人

### 小林信行

  [Unity娘](http://unity-chan.com/)的项目创始人之一，目前在开发UnityChanToonShader Ver2.0(UTS2)<sup>[1]</sup>。
  同时也着手于Unity和maya的插件研发工作。

### 京野光平 a.k.a.ntny

主要负责Unity娘的数字资产制作，并从一位Unity美术工作者的视角经常会提出一些有用的建议。

### 本村·C·纯也

  来自Arc System Works的TA/Director,从模型师入行渐渐转向TA，2007年开始进行卡通Shader的研究。在「GUILTYGEAR XRD」项目中担任模型师，绑定师，Shader制作等工作。之后也担当了「Dragon Ball FighterZ」的Director。

### 冈本鲤太郎

  来自HEXA DIRVE的TA,有多年游戏业的从业经历，从任天堂红白机到索尼PS4、街机、手游、移动VR、PSVR等都有开发经验。日前还发布了一些Maya/3DSMax的基于ShaderFX的实时卡通Shader(DX11)的制作指导视频。

---
[1]关于UTS的细节构成可以参考[Unite Japan 2017](https://www.youtube.com/watch?v=6aNB9LhSx7g&index=)。

## ✯ToonShader设计时的要点

### 1.「近似动漫的画面表现」

其特征就是，基于颜色设定进行的**正确配色设计**。
日式卡通渲染的思路与日式动漫上色思路十分接近，大体上分为**高光**(亮部的亮部)、**基本色**(亮部)、1**号阴影**(暗部)和**2号阴影**(暗部的暗部)。

<figure>
	<a href="/images/unite/toonShader/color.jpg"><img src="/images/unite/toonShader/color.jpg" alt=""></a>
	<figcaption>颜色设定示意图</figcaption>
</figure>

### 2.「ToonShader和CelShader的关系」

下面是本村氏的个人理解

>所有非写实的、NPR类型的表现都可以归类为ToonShader。
>CelShader是在这个分类中，为了**再现赛璐璐式动漫画面表现**的shader。
>ToonShader的语义覆盖范围要大于CelShader。
>
>也会有在一部作品里混用多种ToonShader的情况。比如角色使用CelShader而背景则用ToonShader。还有线条的表现区别，比如会有不使用外框描边的赛璐璐动画表现情况出现。

视频中途穿插了一些业界发展历程，比如Softimage XSI诞生之后，由Metalray初次搭载了ToonShader的原型，松本大洋的代表作`鉄筋コンクリート`就是当时运用这个技术制作的作品。

### 3.「Shader基本构成」

本村氏在公司内部为了提高同事们的shader水平，制作了一份面向美术的Shader入门学习资料，这里把shader的制作过程比喻成咖喱的制作过程，我虽然没做过咖喱，不过看起来似乎确实没那么难。

<figure>
	<a href="/images/unite/toonShader/shaderLike.jpg"><img src="/images/unite/toonShader/shaderLike.jpg" alt=""></a>
	<figcaption>把shader比喻成料理配方</figcaption>
</figure>

shader其实就是记录了如何将原始数据进行**处理**，**组合**并最终**输出**的全过程。尤其是现在有很多基于节点式的shader制作过程，和上图演示的思路很接近。
这里展示了一个简易CelShader的组合思路

<figure>
	<a href="/images/unite/toonShader/SimpleShaderTep.jpg"><img src="/images/unite/toonShader/SimpleShaderTep.jpg" alt=""></a>
	<figcaption>类比料理配方写法的shader</figcaption>
</figure>

在设计ToonShader的过程中，有几个函数是几乎都会用到的，比如HalfLambert，Step()和Lerp()。

这里简单解释一下HalfLambert的含义

我们能看到物体都是基于物体表面对光线的一系列**散射(scattering)**与**吸收(absorption)**的共同作用结果，散射又可以分为散射到物体内部的**折射(refraction)**与**透射(transmission)**和散射到物体外部的**反射(reflection)**

<figure>
	<a href="http://static.zybuluo.com/candycat/7gu6p5xdmzngz53iaa011joy/scattering.png"><img src="http://static.zybuluo.com/candycat/7gu6p5xdmzngz53iaa011joy/scattering.png" alt=""></a>
	<figcaption>《Unity Shader入门精要》P122 图6.2</figcaption>
</figure>

在早期的游戏光照模型理论中，只关心光照经由光源射出后，在物体表面反射一次之后直接被摄影机捕捉到的光线。这种光线被分成四个部分：**环境光照(ambient)**、**漫反射(diffuse)**、**高光反射(specular)**和**自发光(emissive)**。
其中，漫反射光照就是按照**兰伯特定律(Lambert's Law)**进行计算:反射光线的强度与表面法线和光源方向之间夹角的余弦值成正比。下面是反射部分的计算公式：

$$
C_{diffuse} = (C_{light}·m_{diffuse})max(0, \hat{n}·\hat{l})$$

其中，**$$C_{light}$$**为主光源颜色，**$$m_{diffuse}$$**为漫反射颜色，**$$ \hat{n}$$**为表面法线方向，**$$\hat{l}$$**为光源方向。max函数是为了避免点击结果出现负值。

这个光照模型存在一个问题，在光线无法到达的区域，因为表面法线与光源方向的点积小于等于0，所以这个区域会是纯黑色，失去了应有的细节，所以诞生了新的光照模型，**半兰伯特(HalfLambert)光照模型**。

广义的半兰伯特光照模型公式如下：

$$
C_{diffuse} = (C_{light}·m_{diffuse})(\alpha(\hat{n}·\hat{l})+\beta)
$$

可以看出这里没有对点积结果用max函数截取，而是通过对结果进行**$$\alpha$$**倍的缩放和**$$\beta$$**大小的偏移，绝大多数情况下**$$\alpha$$**和**$$\beta$$**的均值取为0.5，公式既为：

$$
C_{diffuse} = (C_{light}·m_{diffuse})(0.5(\hat{n}·\hat{l})+0.5)
$$

这里将点积的范围从[-1,1]重映射到[0,1],保留了之前被截取的有效数据。
需要注意的是，半兰伯特光照模型**没有任何物理依据**，仅仅是一种技术导向的视觉加强技术。可以参考[Valve网站](https://developer.valvesoftware.com/wiki/Half_Lambert)查看详细说明。

这里给出一种在UnityShader中半兰伯特光照模型的示例：

```c#
float4 frag(v2f i) : SV_Target {
  i.normal = normalize(i.normal);
  float3 lightDir = normalize(_worldSpaceLightDir.xyz);
  float halfLambert = 0.5 * dot(i.normal, lightDir) + 0.5;
  float3 diffuse = _LightColor0.rgb * _Diffuse.rgb * halfLambert;
  float3 ambient = UNITY_LIGHTMODEL_AMBIENT.xyz;
  float3 set_finalColor = diffuse + ambient;
  return float4(set_finalColor, 1);
}
```

### 4.「活用遮罩」

在ToonShader的构造过程中，遮罩的设计是整个过程中最重要的部分，光影的分层(diffuse)、高光层(specular)、边缘光效(rimLight)等等都要依靠遮罩才能正确显示，而且这种遮罩会随着光线与视角的变化而变化，实时计算出正确的光影效果。大部分的遮罩都可以由法线向量与其他向量的点积来获得，比如边缘光效可以由法线方向与视角方向的点积结果取反来获得，这里给出一个边缘光效的实现：

```c#
float4 frag(v2f i) : SV_TARGET {
  i.normal = normalize(i.normal);
  float3 viewDirection = normalize(_WorldSpaceCameraPos.xyz - i.worldPos);
  float NdotV = dot(i.normal, viewDirection);
  float rimMask = 1 - NdotV;
  float set_rimMask = pow(rimMask,exp2(lerp(3,0,_RimLight_Power)));
  return float4(set_rimMask,set_rimMask,set_rimMask,1);
}
```

<figure>
	<a href="/images/unite/toonShader/liveMask.jpg"><img src="/images/unite/toonShader/liveMask.jpg" alt=""></a>
	<figcaption>实时计算的遮罩将光影表现的更加灵活</figcaption>
</figure>

### 5.「shader也不是万能的」

在引擎端制作完成生产用Shader之后，仍旧需要在DCC软件<sup>[2]</sup>中制作一份效果一致的shader来方便3D制作人员在制作过程中进行效果确认。某种意义上来说这份shader的重要性不亚于之前为引擎开发的shader，如果没有这个shader，那就和蒙着眼睛画画一样了。

[2]DCC软件:Digital Content Creat Tool的缩写。

<figure>
	<a href="/images/unite/toonShader/DCCShader.jpg"><img src="/images/unite/toonShader/DCCShader.jpg" alt=""></a>
	<figcaption>DCC软件中的效果(左)与游戏实际画面(右)</figcaption>
</figure>

这里可以看出ArcSystemWorks做的真的很好，能够将前后端的效果几乎保持一致，让美术开发人员的效果可以无损体现在最终画面上。

同时，ArcSystemWorks会在制作模型的时候利用顶点色来参与计算模型表面的阴影，这就类似于动漫制作过程中会按照需要考虑光影的位置一样。

类似的还有顶点法线的控制，也可以达到影响投影的效果，只不过对于顶点法线的修改不如顶点色的修改直观。

# つづく