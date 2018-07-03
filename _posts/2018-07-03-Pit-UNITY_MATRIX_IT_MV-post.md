---
layout: post
title: "[坑]UNITY_MATRIX_IT_MV"
description: "记一个坑，关于Unity内法线向量从物体空间向视角空间的正确转换"
modified: 2018-07-03
tags: [Unity, Shader, 坑]
---

描边的shader写法有很多种，考虑到实现难度，我最近最常用的是算两次的阔边描边方法，就是在真正用于渲染模型的Pass之前，增加一个只渲染模型背面并在视角空间中按照顶点法线方向向外扩张一段范围的描边方法。

计算思路为：

```c#
viewPos = viewPos + viewNormal * _Outline;
```

为了防止出现模型背部的凹陷结构在法线扩张方向遮挡模型本身这种情况出现，可以先将视角方向上的法线z方向取值「-0.5」然而对法线归一化来使计算时的法线更加扁平，从而降低遮挡模型本身的可能性。

新的计算思路为：

```c#
viewNormal.z = -0.5;
viewNormal = normalzie(viewNormal);
viewPos = viewPos + viewNormal * _Outline;
```

到这里思路分析就结束了，真正进行计算的时候，这个viewNormal就把我摆了一道。

因为计算要在视角空间下进行，那么pos和normal都要先从模型空间转到视角空间，pos的部分就是常规操作了：

```c#
float4 viewPos = float4(UnityObjectToViewPos(v.vertex),1);
```

在对法线进行转换的时候，我一开始想到的是用UNITY_MATRIX_MV矩阵来转换，这时候Unity会提示
`Use of UNITY_MATRIX_MV is detected. To transform a vertex into view space, consider using UnityObjectToViewPos for better performance.
`
[(官方文档)](https://docs.unity3d.com/Manual/SL-BuiltinFunctions.html)


但是计算出来的结果总是觉得怪怪的，尤其是当模型从视角中心像屏幕边缘移动的时候，甚至会出现边界消失的情况

<figure>
	<a href="/images/missOutline.jpg"><img src="/images/missOutline.jpg" alt=""></a>
	<figcaption>怪怪的描边效果</figcaption>
</figure>

查了一下UnityObjectToViewPos的实现过程，实际上是先将信息转化到**裁剪空间**，然而左乘一个视角转换矩阵来还原到视角空间。

于是我又尝试不使用Unity的推荐写法，直接用UNITY_MATRIX_MV来转换,看起来似乎好多了

<figure>
	<a href="/images/missOutline2.jpg"><img src="/images/missOutline2.jpg" alt=""></a>
	<figcaption>正常多了的描边效果</figcaption>
</figure>

但是当模型出现非等比缩放的时候，问题再次出现

<figure>
	<a href="/images/missOutline3.jpg"><img src="/images/missOutline3.jpg" alt=""></a>
	<figcaption>怪怪的描边效果2</figcaption>
</figure>

那么现在的问题就是：

- 为什么会出现这种奇怪的描边效果

- 为什么使用Unity推荐的写法来替代原有写法，得到的效果却似乎更差了

- 为什么替代的写法与原有写法得到的效果会不同

- 如何得到正确的效果

首先在分析法线之前，我们知道在转换法线信息的同时，也会需要转换模型的切线信息，通常情况下切线与模型的纹理空间对其，与法线方向垂直。

<figure>
	<a href="/images/tangent.jpg"><img src="/images/tangent.jpg" alt=""></a>
	<figcaption>法线与切线</figcaption>
</figure>

因为法线与切线都是方向向量，在空间变换过程中不受平移影响，因此下文涉及的变换矩阵都是3 × 3矩阵。假设现在要将切线向量T,从空间A转换到空间B，可以表示为：

$$
T_B = M_{A\to B}T_A
$$

这种变换在模型处于非同一缩放状态时，法线向量可能会不与模型表面垂直：

<figure>
	<a href="/images/AToB.jpg"><img src="/images/AToB.jpg" alt=""></a>
	<figcaption>非同一缩放下空间变换产生的法线偏移</figcaption>
</figure>

所以就要求解出这种情况下对应的转换矩阵G。

已知模型的法线向量
$$
N_A
$$
与切线向量
$$
T_A
$$
垂直，既
$$
T_A · N_A = 0
$$
。同时，已知
$$
T_B = M_{A\to B}T_A
$$

目标函数为(转换空间后的切线向量与法线向量依旧垂直)：
$$
T_B · N_B = 0
$$

推导过程为：

$$
T_B · N_B = (M_{A\to B}T_A)·(G·N_A) = (M_{A\to B}T_A)^T·(G·N_A) = T_A^T(M_{A\to B}^TG)N_A=0
$$

因为法线矩阵为对角阵，矩阵的转置等于矩阵本身，由于
$$
T_A · N_A = 0
$$
，可以得出，
$$
M_{A\to B}^TG = I
$$
，即
$$
G = (M_{A\to B}^T)^{-1} = (M_{A\to B}^{-1})^T
$$

也就是说，当使用**原变换矩阵的逆转置矩阵**就可以得到正确的结果。

<figure>
	<a href="/images/rightOutline.jpg"><img src="/images/rightOutline.jpg" alt=""></a>
	<figcaption>正确的描边效果</figcaption>
</figure>

这个逆转置矩阵，Unity内就是「UNITY_MATRIX_IT_MV」

这也解释了为什么在使用UnityObjectToViewPos来变换法线的时候会出错了。

参考网址：http://www.lighthouse3d.com/tutorials/glsl-12-tutorial/the-normal-matrix/