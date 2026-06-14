export const STAGES = [
  {
    id: 1,
    slug: 'the-one-idea',
    title: 'The One Idea',
    subtitle: 'Guess. Measure the error. Adjust. Repeat.',
    tagline: 'Before any math — the loop that drives all learning.',
    color: 'ember',
    goal: 'Understand the single idea that underpins every neural network: iterative error correction.',
    estimatedMinutes: 20,
    demoId: 'dial',
    keyTerms: ['loss', 'iteration', 'prediction', 'error'],
    intuition: `
Imagine you're trying to tune a radio dial to a station. You can't see the frequency — you can only hear static.
So you guess, listen, and nudge the dial toward what sounds better. You repeat this until the static clears.

That's it. That's all a neural network ever does.

The network makes a guess. It compares the guess to the real answer and measures how wrong it was — that's the **loss**.
It adjusts its internal dials (called weights) to reduce the loss. Then it does it again. A hundred thousand times if needed.

No mystery, no intelligence — just an extremely patient, extremely fast dial-turner.
    `,
    whyItMatters: `
This "guess-measure-adjust" loop is called **gradient descent** (you'll meet it properly in Stage 3).
It's what makes neural networks trainable without anyone ever writing rules by hand.
The network figures out the rules itself, from examples, one tiny adjustment at a time.
    `,
    videos: [
      {
        title: 'But what is a neural network?',
        creator: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=aircAruvnKk',
        embedId: 'aircAruvnKk',
        duration: '19 min',
        note: 'The single best first watch. Builds intuition with beautiful visuals.',
        stage: 1,
      },
    ],
    exercises: [
      {
        id: 'ex-1-1',
        prompt: 'In the dial demo below, how many adjustments did it take you to hit the target? What happens if you make very large adjustments each time?',
        type: 'reflect',
      },
      {
        id: 'ex-1-2',
        prompt: 'Name three everyday systems that work by the guess-measure-adjust loop (not just computers).',
        type: 'reflect',
      },
    ],
    checkpoint: 'I can explain, in plain English, how a network learns — without using any jargon.',
  },
  {
    id: 2,
    slug: 'a-single-neuron',
    title: 'A Single Neuron',
    subtitle: 'Inputs, weights, and a line through data.',
    tagline: 'The smallest possible learner — and already useful.',
    color: 'ember',
    goal: 'Understand how one neuron multiplies, sums, and predicts — and how it learns to fit a line.',
    estimatedMinutes: 35,
    demoId: null,
    keyTerms: ['neuron', 'weight', 'bias', 'activation', 'linear regression', 'dot product'],
    intuition: `
A single neuron takes a list of numbers as input — say, the square footage and age of a house — and produces one number as output, like an estimated price.

It does this with a dead-simple formula:

**output = w₁·x₁ + w₂·x₂ + b**

Here x₁ and x₂ are the inputs (area, age), w₁ and w₂ are **weights** (how much each input matters), and b is a **bias** (a baseline shift).

The neuron is just a weighted sum, plus a constant.

**Learning** means adjusting w₁, w₂, and b until the formula produces outputs that match the training data as closely as possible.
If it predicts 400,000 and the real answer is 350,000, it nudges the weights to bring the prediction down. It does this for every example in the dataset, over and over.

After enough repetitions, the weights settle at values that give good predictions on new houses the neuron has never seen.

This is called **linear regression** — and one neuron does it perfectly.
    `,
    whyItMatters: `
The single-neuron model (linear regression) is the foundation. Everything more complex is just more neurons, more layers,
and a key trick added in Stage 4 (nonlinearity). Understanding the neuron deeply makes everything downstream click.
    `,
    videos: [
      {
        title: 'But what is a neural network?',
        creator: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=aircAruvnKk',
        embedId: 'aircAruvnKk',
        duration: '19 min',
        note: 'Watch the first 7 minutes for the single-neuron explanation.',
        stage: 2,
      },
      {
        title: 'Neural Networks — StatQuest',
        creator: 'StatQuest with Josh Starmer',
        url: 'https://www.youtube.com/watch?v=CqOfi41LfDw',
        embedId: 'CqOfi41LfDw',
        duration: '20 min',
        note: 'The gentlest step-by-step walkthrough of what a neuron computes.',
        stage: 2,
      },
    ],
    exercises: [
      {
        id: 'ex-2-1',
        prompt: 'A neuron has weights [2, –1] and bias 3. Its inputs are [4, 5]. What is the output? (Do it by hand.)',
        type: 'calculation',
        answer: 'output = 2·4 + (–1)·5 + 3 = 8 – 5 + 3 = 6',
      },
      {
        id: 'ex-2-2',
        prompt: 'If the correct answer in the above example was 10, is the error positive or negative? How should w₁ change — increase or decrease?',
        type: 'reflect',
      },
    ],
    checkpoint: "I can compute a neuron's output by hand given weights, bias, and inputs.",
  },
  {
    id: 3,
    slug: 'gradient-descent',
    title: 'Gradient Descent',
    subtitle: 'Rolling downhill on a landscape of error.',
    tagline: 'The algorithm that actually does the learning.',
    color: 'ember',
    goal: 'Understand what a loss function is, why it shapes a landscape, and how gradient descent finds the lowest point.',
    estimatedMinutes: 45,
    demoId: 'bowl',
    keyTerms: ['loss function', 'mean squared error', 'gradient', 'learning rate', 'derivative', 'local minimum'],
    intuition: `
To adjust the weights, we need to know *which direction* makes the error smaller. Here's how we find out.

Imagine the loss as a hilly landscape. The x-axis is a weight value; the y-axis is how wrong the network is at that weight.
We're standing somewhere on that landscape and we want to get to the valley — the lowest loss.

The **gradient** tells us the slope where we're standing. If the slope rises to the right, we should step left. Simple.

Mathematically, the gradient is the derivative of the loss with respect to each weight. Since you know calculus,
that's just: how much does the loss change if I nudge this weight by a tiny bit?

**The update rule:**
w_new = w_old − α · (∂L/∂w)

Here α (alpha) is the **learning rate** — how big a step to take. Too big and you bounce around the valley without settling.
Too small and it takes forever. This is genuinely the most important hyperparameter in training.

We apply this update for every weight, for every example, for many passes through the data. One full pass is called an **epoch**.
    `,
    whyItMatters: `
Gradient descent is the engine of all of deep learning. Every improvement in AI — GPT, Stable Diffusion, AlphaFold — runs on a variant of this algorithm.
Understanding why it works (and when it struggles, like near saddle points or with bad learning rates) is what separates someone who just runs code from someone who can debug and improve a model.
    `,
    videos: [
      {
        title: 'Gradient descent, how neural networks learn',
        creator: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=IHZwWFHWa-w',
        embedId: 'IHZwWFHWa-w',
        duration: '21 min',
        note: 'The canonical visualization of gradient descent. Watch this first.',
        stage: 3,
      },
      {
        title: 'Gradient Descent — StatQuest',
        creator: 'StatQuest with Josh Starmer',
        url: 'https://www.youtube.com/watch?v=sDv4f4s2SB8',
        embedId: 'sDv4f4s2SB8',
        duration: '10 min',
        note: 'Slower paced, very step-by-step. Great follow-up.',
        stage: 3,
      },
    ],
    exercises: [
      {
        id: 'ex-3-1',
        prompt: 'In the error bowl demo, what happens when you set a very large learning rate? Describe what you see.',
        type: 'reflect',
      },
      {
        id: 'ex-3-2',
        prompt: 'The loss function is L = (y – ŷ)². Compute ∂L/∂ŷ. (Here y is the true value and ŷ is the prediction.) This is the derivative that drives gradient descent.',
        type: 'calculation',
        answer: '∂L/∂ŷ = –2(y – ŷ)',
      },
    ],
    checkpoint: 'I can explain what the learning rate does and why it matters, and I can write down the gradient descent update rule.',
  },
  {
    id: 4,
    slug: 'beyond-one-neuron',
    title: 'Why One Isn\'t Enough',
    subtitle: 'Hidden layers, activation functions, and nonlinearity.',
    tagline: 'The one trick that makes neural networks universal.',
    color: 'ember',
    goal: 'Understand why stacking linear neurons is still linear, and why adding a nonlinear activation function breaks that limit.',
    estimatedMinutes: 40,
    demoId: 'classifier',
    keyTerms: ['hidden layer', 'activation function', 'ReLU', 'sigmoid', 'nonlinearity', 'universal approximation', 'XOR'],
    intuition: `
Here's the problem with stacking linear neurons: a linear function of a linear function is still linear.
No matter how many layers you add, if every neuron is just "weighted sum," the whole network can only draw a straight line through data.

The fix is elegant: after the weighted sum, pass the result through a **nonlinear activation function** before sending it to the next layer.

The simplest modern choice is **ReLU** (Rectified Linear Unit):
**f(x) = max(0, x)**

That's it — if the number is positive, keep it; if it's negative, make it zero. This tiny kink is enough to make networks capable of learning curves, spirals, and boundaries of arbitrary complexity.

Why does it work? Each neuron with a ReLU is like a "feature detector" — it fires (activates) only when its inputs cross a threshold.
Layer by layer, neurons detect increasingly abstract features. In image recognition: first edges, then shapes, then objects.

The XOR problem illustrates this beautifully: no single line can separate the XOR pattern, but two layers with ReLU can.
Watch the demo below to see a two-layer network learn a curved boundary in real time.
    `,
    whyItMatters: `
The **Universal Approximation Theorem** says: a network with enough neurons and a nonlinear activation can approximate *any* function to arbitrary precision.
This is the theoretical backbone of deep learning — the guarantee that the approach is capable enough, in principle, to solve any problem.
    `,
    videos: [
      {
        title: 'What is backpropagation really doing?',
        creator: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U',
        embedId: 'Ilg3gGewQ5U',
        duration: '14 min',
        note: 'Covers hidden layers and why depth matters.',
        stage: 4,
      },
      {
        title: 'Neural Networks — Multiple Layers',
        creator: 'StatQuest with Josh Starmer',
        url: 'https://www.youtube.com/watch?v=IN2XmBhILt4',
        embedId: 'IN2XmBhILt4',
        duration: '12 min',
        note: 'Gentle walk through of hidden layers and activation functions.',
        stage: 4,
      },
    ],
    exercises: [
      {
        id: 'ex-4-1',
        prompt: 'In the live classifier demo, try to separate points without the hidden layer (set neurons = 0 if possible). What boundary can it learn? Now add hidden neurons. What changes?',
        type: 'reflect',
      },
      {
        id: 'ex-4-2',
        prompt: 'Compute ReLU(–3), ReLU(0), and ReLU(5). What is the derivative of ReLU(x) for x > 0? For x < 0?',
        type: 'calculation',
        answer: 'ReLU(–3)=0, ReLU(0)=0, ReLU(5)=5. Derivative: 1 for x>0, 0 for x<0, undefined at x=0.',
      },
    ],
    checkpoint: 'I can explain in one sentence why nonlinear activation functions are essential, and I know what ReLU does.',
  },
  {
    id: 5,
    slug: 'backpropagation',
    title: 'Backpropagation',
    subtitle: 'The chain rule, applied with bookkeeping.',
    tagline: 'Not magic — just careful derivative tracking.',
    color: 'ember',
    goal: "Understand how gradients flow backwards through a network using the chain rule, and why it's efficient.",
    estimatedMinutes: 50,
    demoId: null,
    keyTerms: ['backpropagation', 'chain rule', 'computational graph', 'forward pass', 'backward pass', 'vanishing gradient'],
    intuition: `
We know we need ∂L/∂w for every weight w — that's what gradient descent uses.
For a single neuron, we computed this directly. For a 50-layer network with millions of weights, we need a smarter method.

**Backpropagation** is that method. It uses the chain rule from calculus, applied systematically.

The chain rule says: if y = f(g(x)), then dy/dx = f'(g(x)) · g'(x).
In a network, the loss depends on the final layer, which depends on the layer before it, and so on.
Backpropagation traces that chain all the way back to every weight.

The key insight is efficiency: by working backwards from the loss, we can *reuse* intermediate calculations.
Instead of computing each weight's gradient independently (which would be O(n²)), backprop does it in one backwards pass — O(n).

**Forward pass:** compute the output from inputs, storing each intermediate value.
**Backward pass:** starting from the loss, multiply gradients backwards using the chain rule, layer by layer.

The weights at each layer accumulate their gradient, and then gradient descent updates them all at once.
    `,
    whyItMatters: `
Backpropagation is what makes training deep networks computationally feasible.
Without it, training a modern network would require computing billions of gradients independently.
Andrej Karpathy's micrograd (linked below) builds backprop from scratch in ~100 lines of Python — highly recommended for cementing the intuition.
    `,
    videos: [
      {
        title: 'Backpropagation calculus',
        creator: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=tIeHLnjs5U8',
        embedId: 'tIeHLnjs5U8',
        duration: '10 min',
        note: 'The clearest derivation of backprop using the chain rule. Watch after the main backprop video.',
        stage: 5,
      },
      {
        title: 'What is backpropagation really doing?',
        creator: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U',
        embedId: 'Ilg3gGewQ5U',
        duration: '14 min',
        note: 'Intuitive explanation before the calculus. Watch this first.',
        stage: 5,
      },
      {
        title: 'Neural Networks: Zero to Hero — micrograd',
        creator: 'Andrej Karpathy',
        url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
        embedId: 'VMj-3S1tku0',
        duration: '2h 25min',
        note: 'Builds a backprop engine from scratch. The best exercise for deep understanding.',
        stage: 5,
      },
    ],
    exercises: [
      {
        id: 'ex-5-1',
        prompt: 'Consider a simple chain: L = (a – 1)², a = b², b = w·x where x=2, w=3. Compute dL/dw step by step using the chain rule.',
        type: 'calculation',
        answer: 'b=6, a=36, L=(35)²=1225. dL/da=2(a–1)=70. da/db=2b=12. db/dw=x=2. dL/dw=70·12·2=1680.',
      },
      {
        id: 'ex-5-2',
        prompt: 'Why is the "vanishing gradient" a problem in very deep networks? (Hint: think about what happens when you multiply many numbers less than 1.)',
        type: 'reflect',
      },
    ],
    checkpoint: 'I can trace the chain rule through a two-layer network on paper and explain what the forward and backward passes are.',
  },
  {
    id: 6,
    slug: 'code-it-up',
    title: 'Make It Real in Code',
    subtitle: 'Minimum Python, then PyTorch.',
    tagline: 'From equations on paper to a running network.',
    color: 'ember',
    goal: 'Write a single neuron and a two-layer network from scratch in Python, then meet PyTorch and rebuild the same thing in five lines.',
    estimatedMinutes: 90,
    demoId: null,
    keyTerms: ['Python', 'NumPy', 'PyTorch', 'tensor', 'autograd', 'optimizer', 'SGD', 'epoch', 'batch'],
    intuition: `
You've spent five stages understanding what's happening inside. Now you'll write it.

**Python warmup**

You only need a tiny subset of Python:
- Variables, arithmetic, lists
- Functions (def)
- For loops
- NumPy for arrays

That's it. You don't need classes, decorators, or anything fancy yet.

**Building a neuron from scratch (NumPy):**

\`\`\`python
import numpy as np

# Data: y = 2x + 1
X = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([3, 5, 7, 9, 11], dtype=float)

w, b = 0.0, 0.0
lr = 0.01

for epoch in range(200):
    y_pred = w * X + b
    loss = np.mean((y_pred - y) ** 2)

    dw = np.mean(2 * (y_pred - y) * X)
    db = np.mean(2 * (y_pred - y))

    w -= lr * dw
    b -= lr * db

print(f"w={w:.2f}, b={b:.2f}")  # Should converge to w≈2, b≈1
\`\`\`

**The same thing in PyTorch:**

\`\`\`python
import torch
import torch.nn as nn

X = torch.tensor([[1],[2],[3],[4],[5]], dtype=torch.float32)
y = torch.tensor([[3],[5],[7],[9],[11]], dtype=torch.float32)

model = nn.Linear(1, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
loss_fn = nn.MSELoss()

for epoch in range(200):
    y_pred = model(X)
    loss = loss_fn(y_pred, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
\`\`\`

PyTorch is doing the same thing — it just computes backprop for you automatically.
    `,
    whyItMatters: `
Writing the code by hand once is worth a hundred hours of reading. The equations become real.
After this stage, you'll be able to read any PyTorch tutorial and know exactly what's happening under the hood.
    `,
    videos: [
      {
        title: 'Python for Beginners — Full Course',
        creator: 'freeCodeCamp',
        url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        embedId: 'rfscVS0vtbw',
        duration: '4h 26min',
        note: 'Watch the first 1.5 hours as a Python crash course. Covers everything you need.',
        stage: 6,
      },
      {
        title: 'PyTorch for Deep Learning — Full Course',
        creator: 'freeCodeCamp',
        url: 'https://www.youtube.com/watch?v=V_xro1bcAuA',
        embedId: 'V_xro1bcAuA',
        duration: '25h',
        note: 'Dense but authoritative. Use as a reference — watch sections as needed.',
        stage: 6,
      },
      {
        title: 'Learn PyTorch for Deep Learning',
        creator: 'Daniel Bourke',
        url: 'https://www.youtube.com/watch?v=Z_ikDlimN6A',
        embedId: 'Z_ikDlimN6A',
        duration: '26h',
        note: 'The friendliest full PyTorch course. Chapter 1 is all you need to start.',
        stage: 6,
      },
    ],
    exercises: [
      {
        id: 'ex-6-1',
        prompt: 'Copy the NumPy neuron code and run it. Change the learning rate to 0.1 — what happens? To 0.001? Explain why.',
        type: 'code',
      },
      {
        id: 'ex-6-2',
        prompt: 'Extend the NumPy code to two inputs: y = 3x₁ – 2x₂ + 1. Create training data and train the neuron to recover w₁=3, w₂=–2, b=1.',
        type: 'code',
      },
    ],
    checkpoint: 'I have run gradient descent in Python, by hand, and understand what every line does.',
  },
  {
    id: 7,
    slug: 'teaching-it-to-see',
    title: 'Teaching It to See',
    subtitle: 'Convolutional networks and computer vision.',
    tagline: 'How networks learn to recognize images.',
    color: 'ember',
    goal: 'Understand how convolutional layers extract spatial features from images, why pooling matters, and how a CNN is architecturally different from a fully connected network.',
    estimatedMinutes: 60,
    demoId: null,
    keyTerms: ['CNN', 'convolution', 'kernel', 'filter', 'feature map', 'pooling', 'receptive field', 'stride', 'padding', 'flatten'],
    intuition: `
A fully connected network looks at every pixel equally — it has no notion of spatial structure.
For images, that's wasteful and brittle. A **convolutional layer** fixes this by sharing weights across positions.

**The convolution operation:**
A small matrix called a **kernel** (or filter) slides across the image. At each position, you multiply elementwise and sum — a dot product.
The result is a **feature map** that highlights wherever that kernel's pattern appears in the image.

A 3×3 edge-detecting kernel might look like this:
\`\`\`
–1  0  1
–1  0  1
–1  0  1
\`\`\`
Sliding this across an image produces high values where there's a vertical edge. The network *learns* these kernels during training.

**Multiple filters** — each detecting a different pattern — stack to produce a tensor of feature maps.
Early layers detect edges and textures. Middle layers detect shapes. Late layers detect objects.

**Pooling** downsamples the feature maps (max pooling takes the highest activation in each patch), reducing spatial size while retaining the most important signals.

**Architecture pattern:**
Input → [Conv → ReLU → Pool] × N → Flatten → [Fully Connected] × M → Softmax → Class probabilities

The final fully connected layers combine the extracted features to make the classification decision.
    `,
    whyItMatters: `
CNNs are still the backbone of most computer vision systems — from medical imaging to self-driving cars.
Understanding how they work lets you choose architectures intelligently and debug failures.
After Stage 7, you'll be ready to use pre-trained models like ResNet and adapt them to new problems.
    `,
    videos: [
      {
        title: 'Convolutional Neural Networks — Explained',
        creator: 'StatQuest with Josh Starmer',
        url: 'https://www.youtube.com/watch?v=HGwBXDKFk9I',
        embedId: 'HGwBXDKFk9I',
        duration: '14 min',
        note: 'The clearest gentle intro to how convolution works in image recognition.',
        stage: 7,
      },
      {
        title: 'CS231n: Convolutional Neural Networks for Visual Recognition',
        creator: 'Stanford',
        url: 'https://www.youtube.com/watch?v=vT1JzLTH4G4',
        embedId: 'vT1JzLTH4G4',
        duration: '75 min',
        note: 'Lecture 1 of the classic Stanford course. Goes deeper than you need, but worth it.',
        stage: 7,
      },
    ],
    exercises: [
      {
        id: 'ex-7-1',
        prompt: 'A 28×28 image is convolved with a 3×3 kernel, stride 1, no padding. What is the output size? (Show the formula.)',
        type: 'calculation',
        answer: 'Output size = (28 – 3)/1 + 1 = 26. So 26×26.',
      },
      {
        id: 'ex-7-2',
        prompt: 'What is the advantage of max pooling with a 2×2 window over just using a larger convolution? Think about what information is preserved vs. lost.',
        type: 'reflect',
      },
    ],
    checkpoint: 'I can describe what a convolution operation produces and explain why CNNs are better than fully connected networks for images.',
  },
  {
    id: 8,
    slug: 'capstone',
    title: 'Capstone',
    subtitle: 'Train an image classifier, end to end.',
    tagline: "Everything you've learned, applied to a real dataset.",
    color: 'ember',
    goal: 'Train a complete CNN image classifier in PyTorch — data loading, model definition, training loop, evaluation, and inference.',
    estimatedMinutes: 120,
    demoId: null,
    keyTerms: ['dataset', 'DataLoader', 'training loop', 'validation', 'accuracy', 'overfitting', 'transfer learning', 'inference'],
    intuition: `
You're going to train a network that classifies images. The dataset: CIFAR-10 (60,000 photos in 10 classes —
airplane, car, bird, cat, deer, dog, frog, horse, ship, truck). Or if you have agricultural interest, the PlantVillage dataset (crop vs weed).

**The full pipeline:**

**1. Data loading:**
\`\`\`python
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,0.5,0.5), (0.5,0.5,0.5))
])
train_data = datasets.CIFAR10('./data', train=True, download=True, transform=transform)
train_loader = DataLoader(train_data, batch_size=64, shuffle=True)
\`\`\`

**2. Model definition:**
\`\`\`python
import torch.nn as nn

class Classifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64*8*8, 256), nn.ReLU(),
            nn.Linear(256, 10)
        )
    def forward(self, x):
        return self.classifier(self.features(x))
\`\`\`

**3. Training loop:**
\`\`\`python
model = Classifier()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(10):
    for images, labels in train_loader:
        preds = model(images)
        loss = loss_fn(preds, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    print(f"Epoch {epoch+1} done")
\`\`\`

**4. Evaluation:**
\`\`\`python
correct = total = 0
with torch.no_grad():
    for images, labels in test_loader:
        preds = model(images).argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
print(f"Accuracy: {100*correct/total:.1f}%")
\`\`\`

A well-trained model from scratch gets ~75% on CIFAR-10. Using **transfer learning** (starting from a pre-trained ResNet) gets you to 95%+ with minimal additional training.
    `,
    whyItMatters: `
This is the finish line — and the starting line. After this, you can fine-tune pre-trained models, read research papers, and tackle your own datasets.
The skills you built in Stages 1–7 are all here: gradient descent training the weights, backprop computing gradients, convolutions extracting features, ReLU enabling nonlinearity.
    `,
    videos: [
      {
        title: 'Neural Networks: Zero to Hero — full series',
        creator: 'Andrej Karpathy',
        url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ',
        embedId: null,
        duration: 'Series',
        note: 'The authoritative hands-on series. Episodes 1–4 are directly relevant here.',
        stage: 8,
        isPlaylist: true,
      },
      {
        title: 'Learn PyTorch for Deep Learning — Chapter 3',
        creator: 'Daniel Bourke',
        url: 'https://www.youtube.com/watch?v=Z_ikDlimN6A',
        embedId: 'Z_ikDlimN6A',
        duration: '26h total',
        note: 'Chapter 3 (Computer Vision) is the hands-on CIFAR walkthrough.',
        stage: 8,
      },
    ],
    exercises: [
      {
        id: 'ex-8-1',
        prompt: 'Run the CIFAR-10 training loop for 10 epochs. What accuracy do you achieve? What does the loss curve look like?',
        type: 'code',
      },
      {
        id: 'ex-8-2',
        prompt: 'Add a validation loop that checks accuracy on the test set every epoch. Does your model overfit? (Look for training accuracy much higher than test accuracy.)',
        type: 'code',
      },
      {
        id: 'ex-8-3',
        prompt: 'Optional: Load a pre-trained ResNet-18 from torchvision.models and replace only its final linear layer. Train just that layer for 5 epochs. How does accuracy compare?',
        type: 'code',
      },
    ],
    checkpoint: 'I have trained an image classifier in PyTorch and can describe every step in the pipeline.',
  },
];

export function getStageBySlug(slug) {
  return STAGES.find(s => s.slug === slug) || null;
}

export function getAdjacentStages(id) {
  const idx = STAGES.findIndex(s => s.id === id);
  return {
    prev: idx > 0 ? STAGES[idx - 1] : null,
    next: idx < STAGES.length - 1 ? STAGES[idx + 1] : null,
  };
}
