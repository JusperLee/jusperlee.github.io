---
title: "A Survey of Speech Separation: From Deep Clustering to Multi-Modal Methods"
category: speech
date: 2021-06-01
tags: [Speech Separation, Deep Learning, Cocktail Party Problem, Audio-Visual Models]
extraLinks:
  - label: PDF
    url: "/files/语音分离的总结.pdf"
---

This article provides a comprehensive survey of the speech separation field, covering key methods and recent advances. It is organized into five parts: fundamentals of audio-only speech separation, related works in audio-only separation, fundamentals of multi-modal speech separation, related works in multi-modal separation, and challenges facing both paradigms.

## 1. Fundamentals of Audio-Only Speech Separation

### What is Speech Separation?

Speech separation aims to isolate a target voice from background noise (environmental noise, other voices, etc.), commonly known as the **Cocktail Party Problem**. Based on the number of microphones, the task is divided into **single-channel** and **multi-channel** speech separation.

### Processing Pipeline

The general processing pipeline is:

1. Start with a mixed speech signal (typically containing 2-3 speakers)
2. **Time-frequency domain methods**: Apply Short-Time Fourier Transform (STFT) to convert the time-domain signal into a time-frequency representation
3. **Time-domain methods**: Build an end-to-end encoder-decoder model directly

Time-frequency methods facilitate feature extraction (e.g., MFCC) and allow reconstruction via inverse STFT (iSTFT). The frequency domain decomposes signals into sub-band spaces where properties are stationary.

### Core Challenges

1. **Speaker Independence**: The model must generalize to unseen speakers
2. **Label Permutation Problem**: When a network has a fixed number of outputs (e.g., 2) but the assignment to speakers is ambiguous, the output permutation is unknown

Two main solution families exist: deep clustering-based approaches using high-dimensional embeddings, and Permutation Invariant Training (PIT).

### Datasets

The standard benchmark is the Wall Street Journal (WSJ0) dataset, with subsets si_tr_s (training), si_dt_05 (validation), and si_et_05 (testing). All methods after Deep Clustering train on open speaker sets.

## 2. Key Methods in Audio-Only Speech Separation

### 2.1 Deep Clustering

Deep Clustering [1] trains a deep network to assign discriminative embedding vectors to each time-frequency bin of the spectrogram, enabling implicit prediction of segmentation labels. The objective minimizes the distance between embeddings of T-F regions belonging to the same source while maximizing the distance between embeddings of different sources. At test time, k-means clustering decodes the hidden partitions.

### 2.2 Permutation Invariant Training (PIT & uPIT)

PIT [2] directly minimizes separation error by finding the optimal label permutation assignment. It uses a deep learning model to estimate a set of masks, then applies element-wise multiplication with the mixture spectrogram to recover individual source spectrograms.

uPIT [3] extends PIT from per-frame decisions to utterance-level optimization, computing a single sum over all frames, resulting in an utterance-level MSE objective.

### 2.3 Deep Attractor Network (DANet)

DANet [4] addresses the mismatch between the deep clustering objective and the actual separation goal. By learning cluster centers to generate speaker-specific masks, it provides more flexibility than DPCL and achieves improved results.

### 2.4 TasNet

TasNet [5] performs separation directly in the time domain, overcoming precision limitations of STFT-based methods. Using an encoder-decoder framework, it bypasses the frequency decomposition step, reducing computational cost and output latency while outperforming state-of-the-art causal and non-causal methods.

### 2.5 Conv-TasNet

Conv-TasNet [6] is a fully convolutional time-domain separation network. It uses a linear encoder for waveform representation and stacked 1-D dilated convolutional blocks (Temporal Convolutional Network, TCN) for mask estimation, enabling long-range dependency modeling with a compact model. Conv-TasNet significantly outperforms previous T-F masking methods for both 2-speaker and 3-speaker mixtures.

### 2.6 Dual-Path RNN (DPRNN)

DPRNN [7] addresses the challenge of modeling very long speech sequences. It segments audio input into small chunks and iteratively applies intra-chunk and inter-chunk operations: intra-chunk RNNs process local blocks independently, while inter-chunk RNNs aggregate information across all blocks for utterance-level processing.

### Experimental Results

On the WSJ0-2mix benchmark, Dual-Path-RNN achieves the best results with only 2.6M parameters: 18.8 dB SI-SNRi and 19.0 dB SDRi, substantially surpassing all prior methods.

## 3. Multi-Modal Speech Separation

Audio-visual models for speech separation leverage visual information as input, naturally avoiding the label permutation problem since visual cues are inherently associated with specific speakers. Visual features help "focus" the audio on the desired speaker in the scene, improving separation quality.

Key datasets include AVSpeech, LRS2, and VoxCeleb.

### 3.1 Looking to Listen at the Cocktail Party

This method [8] uses visual features to focus audio on the target speaker. It outperforms existing audio-only methods in mixed speech scenarios and is speaker-independent (trained once, applicable to any speaker), performing better than speaker-dependent approaches.

### 3.2 AV-Model

AV-Model [9] borrows the Conv-TasNet encoder and separation structure for audio processing. The visual component includes a lip embedding extractor (3D convolutional layer + 18-layer ResNet). Audio-visual feature fusion is achieved through simple concatenation along the channel dimension.

## 4. Challenges and Future Directions

1. **Dataset limitations**: WSJ0 features clean speech without background noise or silence regions, far from real-world conditions
2. **Silence handling**: Existing methods struggle with audio containing silence regions
3. **Multi-channel processing**: Microphone array-based speech separation is still in its early stages
4. **Multi-modal fusion**: Current fusion strategies in speech are simplistic (Concat + CNN/RNN/Linear) and need deeper investigation
5. **Visual robustness**: Occlusion of lips or sudden changes in the visual stream affect separation accuracy
6. **Depth information**: Whether incorporating depth information from visual input can positively impact separation results remains to be explored

## References

1. Hershey, J., Chen, Z., Roux, J., Watanabe, S. (2016). Deep clustering: Discriminative embeddings for segmentation and separation. ICASSP 2016.
2. Yu, D., Kolbaek, M., Tan, Z., Jensen, J. (2017). Permutation invariant training of deep models for speaker-independent multi-talker speech separation. ICASSP 2017.
3. Kolbaek, M., Yu, D., Tan, Z., Jensen, J. (2017). Multi-talker Speech Separation with Utterance-level Permutation Invariant Training of Deep Recurrent Neural Networks.
4. Chen, Z., Luo, Y., Mesgarani, N. (2016). Deep attractor network for single-microphone speaker separation.
5. Luo, Y., Mesgarani, N. (2018). TasNet: Time-Domain Audio Separation Network for Real-Time, Single-Channel Speech Separation. ICASSP 2018.
6. Luo, Y., Mesgarani, N. (2018). Conv-TasNet: Surpassing Ideal Time-Frequency Magnitude Masking for Speech Separation. IEEE/ACM TASLP, 27(8), 1256-1266.
7. Luo, Y., Chen, Z., Yoshioka, T. (2019). Dual-path RNN: efficient long sequence modeling for time-domain single-channel speech separation.
8. Ephrat, A., Mosseri, I., Lang, O., Dekel, T., Wilson, K., Hassidim, A., Freeman, W., Rubinstein, M. (2018). Looking to Listen at the Cocktail Party: A Speaker-Independent Audio-Visual Model for Speech Separation. ACM TOG, 37(4), 112.
9. Wu, J., Xu, Y., Zhang, S., Chen, L., Yu, M., Xie, L., Yu, D. (2019). Time Domain Audio Visual Speech Separation. IEEE ASRU 2019.
