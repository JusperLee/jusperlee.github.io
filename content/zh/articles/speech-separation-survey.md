---
title: "语音分离技术综述：从深度聚类到多模态方法"
category: speech
date: 2021-06-01
tags: [语音分离, 深度学习, 鸡尾酒会问题, 视听模型]
extraLinks:
  - label: PDF
    url: "/files/语音分离的总结.pdf"
---

本文是对语音分离领域的总结，主要分享目前语音分离领域的一些重要工作。文章分为五个部分：纯语音分离任务的基本设定、纯语音分离任务的相关工作、多模态语音分离任务的基本设定、多模态语音分离的相关工作，以及纯语音分离和多模态语音分离任务的挑战。

## 一、纯语音分离任务的基本设定

### 什么是语音分离？

语音分离的最终目的是将目标声音与背景噪声（环境噪声、人声等）进行分离，通常被称为"鸡尾酒会问题（Cocktail Party Problem）"。根据说话人（麦克风）的数目，我们通常将语音分离任务分为**单通道（Single-channel）**和**麦克风阵列（Multi-channel）**的语音分离。

### 处理流程

对于语音分离任务，处理流程如下：

1. 首先需要一个混合的语音信号（通常包含两到三个人的语音信号）
2. 对于时频域方法：将时域语音信号进行短时傅里叶变换（STFT），转换为时频域信号
3. 对于时域方法：直接搭建一个 encoder-decoder 的端到端模型

时频域方法更容易进行语音特征提取（如MFCC等），而且经过STFT的时频域信号可以通过逆傅里叶变换（iSTFT）恢复为时域信号。频域本质是把信号分解到每个子带空间上，每个空间里面性质稳定，可以理解为频率恒定。

### 核心挑战

语音分离任务面临两个核心挑战：

1. **说话者无关模型（Speaker Independent）**：训练的模型需要可以应用到所有说话人的语音分离
2. **标签置换问题（Label Permutation Problem）**：类似一个有固定个数输出的系统（如两个输出的神经网络）和三个待分离的说话人 A、B、C，输出的排列组合（Permutation）是未知的

现有的解决方案分为两类：一是深度聚类（Deep Clustering）等基于高维 embedding 的网络结构，二是置换不变训练（Permutation Invariant Training, PIT）。

### 数据集

语音分离任务常用的数据集是华尔街日报数据集（Wall Street Journal, WSJ0），包含 si_tr_s、si_dt_05 和 si_et_05 三个文件夹。

## 二、纯语音分离的相关工作

### 2.1 深度聚类（Deep Clustering）

深度聚类 [1] 通过训练一个深层网络，将对比嵌入向量分配给频谱图的每个时频区域，以便根据输入混合物隐式预测目标频谱图的分段标签。该方法的目标函数是最大程度地减少由同一源控制的时频区域的嵌入之间的距离，同时最大化不同来源的嵌入之间的距离。

### 2.2 帧级别和句子级别的标签不变训练（PIT & uPIT）

PIT [2] 是一种新颖的深度学习训练准则，与深度聚类技术不同，该方法将分离误差直接最小化——直接找到最小标签排列组合。该方法首先使用深度学习模型估计一组掩码（mask），然后通过 mask 点乘混合频谱图来估计单一声音的频谱图。

uPIT [3] 则将 PIT 从每个 meta-frame 独立决定扩展到整个句子的 sum over all frames，使目标函数变为一个 utterance 级别的 MSE。

### 2.3 深度吸引子网络（Deep Attractor Network）

DANet [4] 解决了深度聚类目标函数与实际不符的问题。通过学习聚类中心来对不同的 speaker 生成不同的 mask，与 DPCL 相比更加灵活，得到的结果也更加理想。

### 2.4 TasNet

TasNet [5] 在时域上对音频进行分离，克服了短时傅里叶变换将时域信号转换为频域信号的精度问题。TasNet 使用编码器-解码器框架在时域中直接对信号建模，省去了频率分解步骤。TasNet 优于当前最新的因果和非因果语音分离算法，降低了语音分离的计算成本，并显著降低了输出所需的最小延迟。

### 2.5 Conv-TasNet

Conv-TasNet [6] 是一种全卷积的时域音频分离网络，使用线性编码器来生成语音波形的表示形式。使用由堆叠的一维膨胀卷积块组成的时间卷积网络（TCN）查找掩码，使网络可以对语音信号的长期依赖性进行建模，同时保持较小的模型尺寸。Conv-TasNet 在分离两个和三个 speakers 的混合物方面明显优于以前的时频掩蔽方法。

### 2.6 Dual-Path-RNN

DPRNN [7] 的动机是解决超长语音序列的建模问题。该方法将较长的音频输入分成较小的块，并迭代应用块内和块间操作：块内 RNN 独立处理本地块，块间 RNN 聚合所有块的信息做 utterance-level 的处理。

### 实验结果

在 WSJ0-2mix 数据集上，Dual-Path-RNN 以仅 2.6M 的模型大小达到了 18.8 dB SI-SNRi 和 19.0 dB SDRi 的最佳结果，大幅超越了此前所有方法。

## 三、多模态语音分离

视听模型的语音分离任务由于其视觉信息的输入，不会出现纯语音分离任务的标签置换问题。视觉信息用于将音频"聚焦"到场景中所需的说话者上，从而改善语音分离质量。

主要数据集包括 AVSpeech、LRS2 和 VoxCeleb。

### 3.1 Looking to Listen at the Cocktail Party

该方法 [8] 使用视觉功能将音频"聚焦"到场景中所需的说话者上，在混合语音的情况下优于现有的纯音频语音分离方法。该方法是独立于说话者的（训练一次，适用于任何说话者），比依赖于说话者的方法效果更好。

### 3.2 AV-Model

AV-Model [9] 借鉴了 Conv-TasNet 的 Encoder 和 Separation 结构处理音频，视觉部分包含一个嘴唇嵌入提取器（3D 卷积层 + 18 层 ResNet）。融合视觉特征的过程是通过在卷积通道尺寸上进行简单的串联操作来实现的。

## 四、挑战与展望

1. **数据集局限性**：目前纯语音分离使用的 WSJ0 数据集声音很清晰、无背景噪声、无静音区，与实际应用场景差距较大
2. **静音区处理**：含有静音区的音频，现有方法往往不能很好地处理
3. **麦克风阵列**：多通道的语音分离目前正处于起步阶段
4. **多模态融合**：目前语音领域的融合方式较为单一（Concat + CNN/RNN/Linear），需要更深入的研究
5. **视觉信息鲁棒性**：如果不能准确识别出嘴唇或录像时目标人突然挡住嘴唇，会影响分离的准确性
6. **深度信息**：输入的视觉信息如果考虑其深度信息（位置信息），是否可以对结果产生正向的影响

## 参考文献

1. Hershey, J., Chen, Z., Roux, J., Watanabe, S. (2016). Deep clustering: Discriminative embeddings for segmentation and separation. ICASSP 2016.
2. Yu, D., Kolbaek, M., Tan, Z., Jensen, J. (2017). Permutation invariant training of deep models for speaker-independent multi-talker speech separation. ICASSP 2017.
3. Kolbaek, M., Yu, D., Tan, Z., Jensen, J. (2017). Multi-talker Speech Separation with Utterance-level Permutation Invariant Training of Deep Recurrent Neural Networks.
4. Chen, Z., Luo, Y., Mesgarani, N. (2016). Deep attractor network for single-microphone speaker separation.
5. Luo, Y., Mesgarani, N. (2018). TasNet: Time-Domain Audio Separation Network for Real-Time, Single-Channel Speech Separation. ICASSP 2018.
6. Luo, Y., Mesgarani, N. (2018). Conv-TasNet: Surpassing Ideal Time-Frequency Magnitude Masking for Speech Separation. IEEE/ACM TASLP, 27(8), 1256-1266.
7. Luo, Y., Chen, Z., Yoshioka, T. (2019). Dual-path RNN: efficient long sequence modeling for time-domain single-channel speech separation.
8. Ephrat, A., Mosseri, I., Lang, O., Dekel, T., Wilson, K., Hassidim, A., Freeman, W., Rubinstein, M. (2018). Looking to Listen at the Cocktail Party: A Speaker-Independent Audio-Visual Model for Speech Separation. ACM TOG, 37(4), 112.
9. Wu, J., Xu, Y., Zhang, S., Chen, L., Yu, M., Xie, L., Yu, D. (2019). Time Domain Audio Visual Speech Separation. IEEE ASRU 2019.
