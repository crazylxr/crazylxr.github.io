---
title: "JavaScript 二进制全解（ArrayBuffer、DataView、TypedArray、Blob、File、Base64）"
date: 2024-07-18T20:24:26+08:00
categories:
  - 技术
tags:
  - javascript
  - 前端
---

## 1. 引言

在现代 Web 开发中，二进制数据扮演着至关重要的角色。无论是在图像处理、音频视频流、文件上传还是网络通信中，二进制数据都以其高效性和灵活性被广泛应用。JavaScript 作为 Web 开发的基石，提供了一套丰富的 API 来处理二进制数据，包括 ArrayBuffer、DataView、TypedArray、Blob、File 和 Base64 等。

由于这些 API 如果仅仅做页面开发，一般用不上，所以很多人在真正需要用到二进制处理的时候，不知道应该用哪个，也不知道怎么用，本文旨在讲清楚这些 API 的差别和使用场景，解决当你需要用到二进制数据处理的时候可以游刃有余，对于 API 的使用查 MDN 就行。

## 2. ArrayBuffer、TypedArray、DataView

### 关系概览

​![image](https://imgs.taoweng.site/image-20240707102758-i9cz7mv.png)​

‍

**ArrayBuffer** 是整个二进制数据最关键、最基本的对象，表示**对固定长度的连续内存空间的引用。**

> 注意：ArrayBuffer 应该把他当做 Buffer，不是 Array 来看待，它没有任何 Array 相关的方法，仅仅只是一块内存数据的引用，也没办法直接进行读取和设置

创建 ArrayBuffer 使用方式：

```javascript
let buffer = new ArrayBuffer(16); // 创建一个长度为 16字节 的 buffer
alert(buffer.byteLength); // 16
```

​`ArrayBuffer`​ 是一个内存区域。是无法知道里面存的是什么数据类型的，只是一个元素的字节序列。 如果要读取和设置，需要用到 **“视图”** 对象，`TypedArray`​ 或者 `DataView`​ 。

‍

### TypedArray

TypedArray 是一个通用的术语，没有这个构造函数，是下面这些构造函数的统称：

1. **Int8Array**: 8 位有符号整数数组。
2. **Uint8Array**: 8 位无符号整数数组。
3. **Uint8ClampedArray**: 8 位无符号整数数组，但当赋值超出范围时会被自动调整到 0 或 255。
4. **Int16Array**: 16 位有符号整数数组。
5. **Uint16Array**: 16 位无符号整数数组。
6. **Int32Array**: 32 位有符号整数数组。
7. **Uint32Array**: 32 位无符号整数数组。
8. **Float32Array**: 32 位浮点数数组。
9. **Float64Array**: 64 位浮点数数组。

​![image](https://imgs.taoweng.site/image-20240717215625-w7snx1a.png)​

TypeArray 是基于 ArrayBuffer 的一种**类型化数组**，用于操作 ArrayBuffer 的，类型是很关键的一点，直接决定了操作的时候的颗粒度。

```javascript
// 创建一个 ArrayBuffer
let buffer = new ArrayBuffer(16);

// 创建一个 Int32Array，基于上述 ArrayBuffer
let typedArray = new Int32Array(buffer);

// 访问和修改 Int32Array
typedArray[0] = 42;
console.log(typedArray[0]); // 42
```

​`TypedArray`​ 具有常规的 `Array`​ 方法，比如 `map`​，`slice`​，`find`​ 和 `reduce`​ 等。

但是

- 没有 `splice`​ —— 因为 类型化数组是缓冲区（buffer）上的视图，并且缓冲区（buffer）是固定的、连续的内存区域。我们所能做的就是分配一个值。

- 无 `concat`​ 方法，同上，buffer 是固定的，无法增加。

### DataView

​`DataView`​ 是 JavaScript 中的一个对象，它提供了一种低级访问和操作固定长度的二进制数据缓冲区（`ArrayBuffer`​）的方式。与 `TypedArray`​ 不同，`DataView`​ 不会为存储的数据指定特定的数据类型，因此它允许你以多种不同的数值类型读取和写入 `ArrayBuffer`​ 中的字节。

#### 主要特点

1. **灵活性**：`DataView`​ 允许你以不同的数据类型（如 `int8`​, `uint8`​, `int16`​, `uint16`​, `int32`​, `uint32`​, `float32`​, `float64`​）访问 `ArrayBuffer`​ 中的数据。
2. **字节对齐**：`DataView`​ 允许你指定字节对齐方式，这意味着你可以从任意字节偏移量开始读取数据，而不需要像 `TypedArray`​ 那样必须从 `ArrayBuffer`​ 的开始处开始。
3. **不固定类型**：与 `TypedArray`​ 不同，`DataView`​ 不会为存储的数据指定固定的数据类型，这使得它在处理不同数据类型时更加灵活。

#### 创建 DataView

你可以通过将一个 `ArrayBuffer`​ 传递给 `DataView`​ 构造函数来创建一个 `DataView`​ 对象。

```javascript
let buffer = new ArrayBuffer(16);
let dataView = new DataView(buffer);
```

#### 使用 DataView

​`DataView`​ 提供了多种方法来读取和写入数据，这些方法允许你指定数据类型和字节偏移量。

- **读取数据**：

  - ​`getInt8(byteOffset)`​
  - ​`getUint8(byteOffset)`​
  - ​`getInt16(byteOffset, littleEndian)`​
  - ​`getUint16(byteOffset, littleEndian)`​
  - ​`getInt32(byteOffset, littleEndian)`​
  - ​`getUint32(byteOffset, littleEndian)`​
  - ​`getFloat32(byteOffset, littleEndian)`​
  - ​`getFloat64(byteOffset, littleEndian)`​

- **写入数据**：

  - ​`setInt8(byteOffset, value)`​
  - ​`setUint8(byteOffset, value)`​
  - ​`setInt16(byteOffset, value, littleEndian)`​
  - ​`setUint16(byteOffset, value, littleEndian)`​
  - ​`setInt32(byteOffset, value, littleEndian)`​
  - ​`setUint32(byteOffset, value, littleEndian)`​
  - ​`setFloat32(byteOffset, value, littleEndian)`​
  - ​`setFloat64(byteOffset, value, littleEndian)`​

#### 示例

```javascript
let buffer = new ArrayBuffer(16);
let dataView = new DataView(buffer);

// 写入数据
dataView.setInt32(0, 42); // 在偏移量0处写入一个 int32 值
dataView.setFloat32(4, 3.14); // 在偏移量4处写入一个 float32 值

// 读取数据
console.log(dataView.getInt32(0)); // 输出：42
console.log(dataView.getFloat32(4)); // 输出：3.14
```

在这个示例中，我们首先创建了一个大小为 16 字节的 `ArrayBuffer`​，然后创建了一个 `DataView`​。我们使用 `DataView`​ 的方法在 `ArrayBuffer`​ 的不同偏移量处写入和读取数据。

#### 注意事项

- ​`DataView`​ 的方法会检查偏移量和数据类型是否在 `ArrayBuffer`​ 的范围内。如果超出范围，会抛出错误。
- ​`DataView`​ 提供的灵活性使得它在处理不同数据类型和字节对齐时非常有用，尤其是在处理复杂的二进制数据时。

​`DataView`​ 是处理二进制数据的强大工具，特别是在需要从 `ArrayBuffer`​ 中读取和写入不同数据类型时。

‍

## 3. Blob、File

​`Blob`​ 和 `File`​ 都是 Web API 中用于处理二进制数据的对象，但它们有一些关键的区别和联系。

### Blob

​`Blob`​（Binary Large Object）是一个表示不可变原始数据的接口。它主要用于处理二进制数据，比如图片、视频、音频文件等。以下是 `Blob`​ 的一些主要特点：

1. **不可变性**：一旦创建，`Blob`​ 的内容不能被修改。
2. **类型**：`Blob`​ 对象有一个 `type`​ 属性，表示数据的 MIME 类型。
3. **大小**：`Blob`​ 对象有一个 `size`​ 属性，表示数据的大小（以字节为单位）。
4. **灵活性**：`Blob`​ 可以包含任何类型的数据，并且可以被创建为一个单独的 `Blob`​ 或者通过组合其他 `Blob`​ 对象来创建。

### File

​`File`​ 是 `Blob`​ 的一个子类，专门用于表示文件。它继承了 `Blob`​ 的所有属性和方法，并且添加了一些与文件相关的额外属性和功能。以下是 `File`​ 的一些主要特点：

1. **文件名**：`File`​ 对象有一个 `name`​ 属性，表示文件的名称。
2. **最后修改时间**：`File`​ 对象有一个 `lastModified`​ 属性，表示文件的最后修改时间（以毫秒为单位）。
3. **文件类型**：`File`​ 对象继承了 `Blob`​ 的 `type`​ 属性，表示文件的 MIME 类型。
4. **文件大小**：`File`​ 对象继承了 `Blob`​ 的 `size`​ 属性，表示文件的大小（以字节为单位）。

### 创建 Blob 和 File

- **Blob**：

  - 可以通过构造函数直接创建一个空的 `Blob`​。
  - 也可以通过传递数据（如字符串、数组或 `TypedArray`​）和选项（如 `type`​）来创建。

  ```javascript
  let textBlob = new Blob(["Hello, world!"], { type: "text/plain" });
  ```

- **File**：

  - 通常通过 `<input type="file">`​ 元素或拖放操作获取文件，然后将其转换为 `File`​ 对象。
  - 也可以通过将文件数据和文件名传递给 `File`​ 构造函数来创建。

  ```javascript
  let file = new File(["Hello, world!"], "example.txt", { type: "text/plain" });
  ```

### 联系

- **继承关系**：`File`​ 是 `Blob`​ 的子类，因此它继承了 `Blob`​ 的所有属性和方法。
- **用途**：两者都用于处理二进制数据，但 `File`​ 更专注于文件数据，而 `Blob`​ 更通用。
- **操作**：你可以对 `Blob`​ 和 `File`​ 执行类似的操作，比如切片、生成 URL 等。

### 示例

```javascript
// 创建一个 Blob
let blob = new Blob(["Hello, world!"], { type: "text/plain" });

// 创建一个 File
let file = new File(["Hello, world!"], "example.txt", { type: "text/plain" });

// 获取 Blob 和 File 的属性
console.log(blob.size); // 输出：13
console.log(blob.type); // 输出：text/plain

console.log(file.size); // 输出：13
console.log(file.type); // 输出：text/plain
console.log(file.name); // 输出：example.txt
console.log(file.lastModified); // 输出：文件的最后修改时间
```

在这个示例中，我们创建了一个 `Blob`​ 和一个 `File`​，然后打印了它们的属性。可以看到，`File`​ 除了包含 `Blob`​ 的属性外，还额外包含了文件名和最后修改时间。

### Blob URL

无论是 `Blob`​ 还是 `File`​，都可以生成一个 URL，这个 URL 可以被用来在浏览器中引用这个对象。

```javascript
let blobUrl = URL.createObjectURL(blob);
let fileUrl = URL.createObjectURL(file);

// 使用 Blob URL 加载图片
let img = document.createElement("img");
img.src = blobUrl;
document.body.appendChild(img);
```

在这个示例中，我们生成了 `Blob`​ 和 `File`​ 的 URL，并使用这些 URL 来加载一个图片元素。

总结来说，`Blob`​ 和 `File`​ 都是处理二进制数据的重要工具，`File`​ 是 `Blob`​ 的一个特化形式，专门用于文件数据。

‍

### ArrayBuffer 和 Blob 的关系

#### 关系

- **数据表示**：`ArrayBuffer`​ 和 `Blob`​ 都可以表示原始的二进制数据，但 `Blob`​ 通常用于表示更大的数据块，如文件，而 `ArrayBuffer`​ 更常用于较小的数据块。
- **不可变性**：`Blob`​ 是不可变的，一旦创建，其内容不能被修改。而 `ArrayBuffer`​ 本身也是不可变的，但通过 `TypedArray`​ 视图可以修改其内容。
- **用途**：`Blob`​ 更多地用于处理文件和图像等大型二进制对象，而 `ArrayBuffer`​ 更多地用于在 Web Workers 或其他需要高效数据传输的场景中。
- **转换**：`ArrayBuffer`​ 可以转换为 `Blob`​，因为 `ArrayBuffer`​ 可以作为参数传递给 `Blob`​ 构造函数来创建一个新的 `Blob`​ 对象。这允许你将 `ArrayBuffer`​ 中的数据作为 `Blob`​ 对象使用，例如用于文件上传。

#### 示例：ArrayBuffer 转换为 Blob

```javascript
// 创建一个 ArrayBuffer
let buffer = new ArrayBuffer(16);

// 将 ArrayBuffer 转换为 Blob
let blob = new Blob([buffer], { type: "application/octet-stream" });
```

在这个示例中，我们首先创建了一个 `ArrayBuffer`​，然后将其转换为一个 `Blob`​ 对象。这样，我们就可以使用 `Blob`​ 的方法和属性来进一步处理这些数据。

总结来说，`Blob`​ 和 `ArrayBuffer`​ 都是处理二进制数据的重要工具，但它们在用途和表示方式上有所不同。`Blob`​ 更适合处理大型的、不可变的数据块，而 `ArrayBuffer`​ 更适合在需要高效数据访问和传输的场景中使用。

## 4. Base64

Base64 是一种编码方法，用于将二进制数据转换成 64 个可打印字符的文本字符串。这种编码主要用于在文本格式中表示二进制数据，比如在电子邮件、网页或配置文件中传输图像或其他二进制文件。

### 编码原理

Base64 编码使用一个由 64 个字符组成的字符集，这 64 个字符包括大写和小写字母 A-Z、数字 0-9，以及两个特殊字符 '+' 和 '/'。此外，为了处理编码后字符串的长度，Base64 还使用一个填充字符 '='。

- **字符集**：A-Z, a-z, 0-9, '+', '/'
- **填充字符**：'='

在 Base64 编码中，每 4 个字节的二进制数据被转换成 3 个字符的 Base64 编码字符串。如果原始数据不是 3 的倍数，则在编码的末尾添加一个或两个填充字符 '='。

### 编码过程

1. **将二进制数据分成每组 3 个字节**：每组 3 个字节转换成 4 个字节的二进制数。
2. **将 4 个字节的二进制数转换成一个 6 位的二进制数**：不足 6 位的部分在前面补零。
3. **将 6 位的二进制数映射到 Base64 字符集中的字符**：每个 6 位二进制数对应一个 Base64 字符。
4. **处理剩余字节**：如果剩余的字节不足 3 个，需要在编码的末尾添加一个或两个 '=' 字符作为填充。

### 解码过程

1. **将 Base64 编码字符串分割成每 4 个字符一组**：每组 4 个字符对应 3 个字节的原始数据。
2. **将每个 Base64 字符转换回 6 位的二进制数**。
3. **将 6 位的二进制数重新组合成原始的字节序列**。
4. **处理填充字符**：如果编码字符串的末尾包含 '=' 字符，则在解码时去掉这些填充字符。

### 示例

假设我们有一个二进制数据 "Man"，其字节值为：

- M: 77 (二进制 01001101)
- a: 97 (二进制 01100001)
- n: 110 (二进制 01101110)

1. 将 "Man" 转换为二进制：01001101 01100001 01101110
2. 将二进制数据分成每组 6 位：010 011001 100001 101011 10
3. 将每组 6 位二进制数映射到 Base64 字符集：TWFu (对应于 T:010, W:011001, F:100001, u:101011)
4. 由于原始数据不足 3 个字节，编码字符串末尾添加两个 '=' 字符：TWFu==

解码过程则相反，将 "TWFu==" 转换回原始的二进制数据 "01001101 01100001 01101110"，最终恢复为 "Man"。

### JavaScript 中的 Base64 编码和解码

在 JavaScript 中，可以使用 `btoa()`​ 和 `atob()`​ 函数来实现 Base64 编码和解码：

```javascript
// 编码
let binaryData = "Man";
let base64Encoded = btoa(binaryData);
console.log(base64Encoded); // 输出：TWFu

// 解码
let base64Decoded = atob(base64Encoded);
console.log(base64Decoded); // 输出：Man
```

注意：`btoa()`​ 和 `atob()`​ 函数在处理非 ASCII 字符时可能会遇到问题，因为它们仅支持单字节字符编码（即拉丁字符集）。对于包含非拉丁字符的数据，可能需要使用其他方法，如使用 `Uint8Array`​ 和 `TextEncoder`​。

### 用途

Base64 编码的主要用途包括：

- 在文本格式中传输二进制数据，如在电子邮件中发送图像。
- 在网页中内嵌图像或其他二进制文件。
- 在配置文件中存储二进制数据。
- 作为数据传输的一种方式，尤其是在不支持二进制传输的环境中。

Base64 编码是一种非常实用的工具，尤其是在需要在文本环境中处理二进制数据时。

### Base64 和 ArrayBuffer、Blob 之间的关系

#### 关系

1. **数据表示**：`ArrayBuffer`​ 和 `Blob`​ 都用于表示原始二进制数据，但 `Blob`​ 更多地用于处理文件和图像等大型二进制对象，而 `ArrayBuffer`​ 更多地用于在需要高效数据访问和传输的场景中。
2. **编码与传输**：Base64 编码可以将 `ArrayBuffer`​ 或 `Blob`​ 中的二进制数据转换为可打印的文本格式，这使得二进制数据可以以文本形式存储和传输。这对于在不支持二进制传输的环境中传输数据非常有用。
3. **转换**：

   - 可以将 `ArrayBuffer`​ 或 `Blob`​ 转换为 Base64 编码的字符串，以便在文本格式中存储或传输。
   - 也可以将 Base64 编码的字符串解码回 `ArrayBuffer`​ 或 `Blob`​，以便在需要时重新获取原始二进制数据。

#### 示例

```javascript
// 创建一个 ArrayBuffer
let buffer = new ArrayBuffer(16);

// 将 ArrayBuffer 转换为 Blob
let blob = new Blob([buffer], { type: "application/octet-stream" });

// 将 ArrayBuffer 转换为 Base64 编码的字符串
let arrayBufferView = new Uint8Array(buffer);
let base64String = arrayBufferView.reduce(
  (data, byte) => data + String.fromCharCode(byte),
  ""
);
console.log(btoa(base64String));

// 将 Base64 编码的字符串解码回 ArrayBuffer
let decodedArrayBuffer = atob(base64String);
let typedArray = new Uint8Array(decodedArrayBuffer.length);
typedArray.set(decodedArrayBuffer.split("").map(char => char.charCodeAt(0)));
console.log(typedArray);
```

在这个示例中，我们展示了如何将 `ArrayBuffer`​ 转换为 `Blob`​ 和 Base64 编码的字符串，以及如何将 Base64 编码的字符串解码回 `ArrayBuffer`​。

总结来说，Base64、`ArrayBuffer`​ 和 `Blob`​ 都是处理二进制数据的不同工具，它们在不同的场景下各有用途。Base64 编码特别适用于在文本环境中传输二进制数据，而 `ArrayBuffer`​ 和 `Blob`​ 更多地用于在内存中存储和操作二进制数据。

## 5. 之间的互转方法

### ArrayBuffer 转换为 Blob

1. **直接转换**：可以将 `ArrayBuffer`​ 直接作为参数传递给 `Blob`​ 构造函数来创建一个新的 `Blob`​ 对象。
2. **示例**：

   ```javascript
   let buffer = new ArrayBuffer(16);
   let blob = new Blob([buffer], { type: "application/octet-stream" });
   ```

### Blob 转换为 ArrayBuffer

1. **使用 FileReader**：可以使用 `FileReader`​ 对象读取 `Blob`​ 对象的内容，并将其转换为 `ArrayBuffer`​。
2. **示例**：

   ```javascript
   let blob = new Blob(["Hello, world!"], { type: "text/plain" });
   let reader = new FileReader();

   reader.onload = function (event) {
     let arrayBuffer = event.target.result;
     console.log(arrayBuffer);
   };

   reader.readAsArrayBuffer(blob);
   ```

### ArrayBuffer 转换为 Base64

1. **转换为 TypedArray**：首先将 `ArrayBuffer`​ 转换为 `TypedArray`​（如 `Uint8Array`​），然后使用 `TypedArray`​ 的元素生成 Base64 编码字符串。
2. **示例**：

   ```javascript
   let buffer = new ArrayBuffer(16);
   let arrayBufferView = new Uint8Array(buffer);

   let base64String = arrayBufferView.reduce(
     (data, byte) => data + String.fromCharCode(byte),
     ""
   );
   let encodedString = btoa(base64String);
   console.log(encodedString);
   ```

### Base64 转换为 ArrayBuffer

1. **解码为字符串**：首先使用 `atob()`​ 函数将 Base64 编码的字符串解码为原始的二进制字符串。
2. **转换为 TypedArray**：将解码后的字符串转换为 `TypedArray`​（如 `Uint8Array`​），然后将 `TypedArray`​ 作为参数传递给 `ArrayBuffer`​ 构造函数来创建新的 `ArrayBuffer`​。
3. **示例**：

   ```javascript
   let base64String = "SGVsbG8sIHdvcmxkIQ=="; // "Hello, world!" 的 Base64 编码
   let decodedString = atob(base64String);

   let typedArray = new Uint8Array(decodedString.length);
   typedArray.set(decodedString.split("").map(char => char.charCodeAt(0)));

   let buffer = typedArray.buffer;
   console.log(buffer);
   ```

### Blob 转换为 Base64

1. **使用 FileReader**：读取 `Blob`​ 对象的内容，并将其转换为 Base64 编码的字符串。
2. **示例**：

   ```javascript
   let blob = new Blob(["Hello, world!"], { type: "text/plain" });
   let reader = new FileReader();

   reader.onload = function (event) {
     let base64String = event.target.result;
     console.log(base64String);
   };

   reader.readAsText(blob);
   ```

### Base64 转换为 Blob

1. **解码为二进制数据**：使用 `atob()`​ 函数将 Base64 编码的字符串解码为原始的二进制字符串。
2. **转换为 Blob**：将解码后的二进制字符串转换为 `Blob`​ 对象。
3. **示例**：

   ```javascript
   let base64String = "SGVsbG8sIHdvcmxkIQ=="; // "Hello, world!" 的 Base64 编码
   let decodedString = atob(base64String);
   let arrayBuffer = new Uint8Array(decodedString.length);
   arrayBuffer.set(decodedString.split("").map(char => char.charCodeAt(0)));

   let blob = new Blob([arrayBuffer], { type: "text/plain" });
   console.log(blob);
   ```

通过这些转换方法，开发者可以根据具体需求灵活地在不同的数据格式之间进行转换，以适应不同的应用场景。

## 5. 总结

在 JavaScript 里关于二进制相关的应该基本都包含了，最重要的是了解他们的使用场景：

- **ArrayBuffer** 适用于需要高效数据访问和传输的场景，如 Web Workers 或网络通信。
- **Blob** 和 **File** 更多地用于处理文件和图像等大型二进制对象，适合在文件上传或图像处理中使用。
- **Base64** 编码特别适用于在文本环境中传输二进制数据，如在电子邮件中发送图像或在网页中内嵌图像。

## 参考

[二进制数据，文件 (javascript.info)](https://zh.javascript.info/binary)

[Blob (javascript.info)](https://zh.javascript.info/blob)

[ArrayBuffer，二进制数组 (javascript.info)](https://zh.javascript.info/arraybuffer-binary-arrays)

[TextDecoder 和 TextEncoder (javascript.info)](https://zh.javascript.info/text-decoder)

[Blob、ArrayBuffer、File、FileReader 和 FormData 的区别 - 掘金 (juejin.cn)](https://juejin.cn/post/6915795898609975309)

[前端二进制 ArrayBuffer、TypedArray、DataView、Blob、File、Base64、FileReader 一次性搞清楚 - 掘金 (juejin.cn)](https://juejin.cn/post/7046313942938812424)

‍
