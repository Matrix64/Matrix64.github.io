---
layout: post
title: "摄影建模流程简介"
description: "本篇记录了摄影建模工作流程的操作过程"
modified: 2018-08-06
tags: [RealityCapture, Photogrammetry]
image:
  feature: /0806_PhotogrammetryPipeline_Title.jpg
---

# 摄影测量法 / Photogrammetry

其实看到这个技术的出现我的觉得留给单纯的模型师的生存空间真的越来越小了，拿着相机咔嚓咔嚓一小时获得的成果可能比传统建模一周的内容还要多。

其实摄影测量工作流程也不是现在才开始流行，之前随着Unity2018一起发布的场景工程「死者之书」中，就已经运用了这种技术，更早的还有在HTC Vive的Valve办公室场景，更是直接把V社办公室的空间都通过摄影测量方式在VR中高质量还原了出来。

而且摄影测量使用得当的话，也会加速制作进程

<figure>
 <img src="/images/0806_PhotogrammetryWorkCost.jpg" alt="">
 <figcaption>工时比</figcaption>
</figure>

## 摄影测量工作流程

流程大体上可以分为「**拍摄**」-「**重建**」-「**材质制作**」-「**优化**」

### 拍摄

对于拍摄设备没有特别的硬性要求，原则上是拍出来的相片分辨率越高越好，推荐还是使用全画幅相机，不过对于一些相机很难取景的位置，使用GoPro之类的小型设备也是个不错的选择。

拍照的时候，尽量保证每幅图片之间的重叠率超过90%，比如对于圆柱形物体的采样，最低也要36张图，也就是每10度一张。永远不要觉得照片拍的过多，对于后期软件计算点云来说，每多一张照片都有可能解决一个后期很难修复的模型问题。

### 重建

这里涉及到的软件有「**RealityCapture**」「Zbrush」「Maya」

核心还是使用RealityCapture来对照片进行点云计算，生成初步的3D模型与贴图，这一步里得到的数据看起来已经很接近最终效果了，只是点云生成的模型三角面数量庞大，无法直接使用。

<figure>
 <a href="/images/0806_Photogrammetry_RealityCapture_full.jpg"><img src="/images/0806_Photogrammetry_RealityCapture_mini.jpg" alt=""></a>
 <figcaption>RealityCapture截图</figcaption>
</figure>

之后导出高模到Zbrush中进行减面处理，优化模型拓扑结构。在maya中进行低模修复操作，补洞，修复错误点等等。

<figure>
 <a href="/images/0806_Photogrammetry_ZBrush_full.jpg"><img src="/images/0806_Photogrammetry_ZBrush_mini.jpg" alt=""></a>
 <figcaption>在ZBrush中约有3.499Million个顶点</figcaption>
</figure>

<figure>
 <a href="/images/0806_Photogrammetry_Maya_full.jpg"><img src="/images/0806_Photogrammetry_Maya_mini.jpg" alt=""></a>
 <figcaption>重构后在Maya中约有7.5万个顶点，依旧是个不小的数目</figcaption>
</figure>

### 材质制作

到这里其实就渐渐回到次世代美术工作流程中来了，现在就可以利用之前得到的高低模型烘焙所需的贴图，导入Substance Designer中制作最终所需的材质。不论最终是输出到maya用于渲染，还是输出到Unity/Unreal引擎，SD都可以快速完成想要的效果。

### 优化

这一步是针对实时渲染引擎来说，通常即使是通关zb重建的模型，面数依旧很高，任旧需要制作LOD，合理分配光照UV等等操作来提高运行性能。

然后下面就是我在八猴里的一些预览效果图了：

<figure>
 <a href="/images/0806_PhotogrammetryPipeline_Title.jpg"><img src="/images/0806_PhotogrammetryPipeline_mini.jpg" alt=""></a>
</figure>

<figure>
 <a href="/images/0806_Photogrammetry_Show2_full.jpg"><img src="/images/0806_Photogrammetry_Show2_mini.jpg" alt=""></a>
</figure>

<figure>
 <a href="/images/0806_Photogrammetry_Show3_full.jpg"><img src="/images/0806_Photogrammetry_Show3_mini.jpg" alt=""></a>
</figure>

更多角度的图片就放在[A站](https://www.artstation.com/artwork/x8Jr1)了。

参考文档：[Unity Photogrammetry Workflow](https://unity3d.com/files/solutions/photogrammetry/Unity-Photogrammetry-Workflow_2017-07_v2.pdf)