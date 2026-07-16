# 文明纪元 - 文件夹结构说明

> 本文档解释项目中每个文件夹和文件的作用，帮助你快速了解项目结构。

---

## 📁 根目录文件

| 文件名 | 作用 |
|--------|------|
| `README.md` | 项目总说明文档，介绍整合包内容、特性、使用方法 |
| `LICENSE` | MIT 开源许可证，说明代码使用权限（完全开源） |
| `build.gradle` | 根 Gradle 构建脚本，配置所有子模块的通用构建设置 |
| `settings.gradle` | Gradle 项目设置，定义包含哪些子模块 |
| `gradle.properties` | Gradle 属性配置，如 Minecraft 版本、Forge 版本等 |
| `manifest.json` | 整合包模组清单（详细版，含分类说明） |
| `.gitignore` | Git 忽略文件配置，指定哪些文件不提交到仓库 |

---

## 📁 自创模组源码（4个）

### 1. `civilization-core/` - 文明核心模组
**作用**：整合包的核心模组，提供基础的时代系统、货币系统、玩家数据存储

| 子文件夹/文件 | 作用 |
|--------------|------|
| `build.gradle` | 该模组的 Gradle 构建配置 |
| `src/main/java/com/civilizationera/core/` | Java 源码主目录 |
| `CivilizationCore.java` | 模组主类，入口点 |
| `era/Era.java` | 纪元枚举类，定义8个纪元 |
| `era/EraManager.java` | 纪元管理器，处理纪元切换逻辑 |
| `item/CoreItems.java` | 物品注册（进化碎片、铜币、银币、金币等） |
| `capability/CapabilityHandler.java` | 玩家能力系统（存储纪元、碎片、货币数据） |
| `src/main/resources/META-INF/mods.toml` | 模组描述文件（Forge 识别模组用） |
| `build/libs/` | 编译输出目录（编译后会生成 .jar 文件） |

### 2. `faction-economy/` - 势力与经济模组
**作用**：六大势力系统、声望系统、动态市场经济

| 子文件夹/文件 | 作用 |
|--------------|------|
| `build.gradle` | 该模组的 Gradle 构建配置 |
| `src/main/java/com/civilizationera/faction/` | Java 源码主目录 |
| `FactionEconomy.java` | 模组主类 |
| `faction/FactionType.java` | 势力类型枚举（六大势力） |
| `faction/FactionManager.java` | 势力管理器（声望、对立关系） |
| `economy/MarketManager.java` | 市场管理器（价格波动、供需关系） |
| `src/main/resources/META-INF/mods.toml` | 模组描述文件 |

### 3. `tech-research/` - 科技研究模组
**作用**：科技碎片、蓝图系统、研究台、碎片化科技树

| 子文件夹/文件 | 作用 |
|--------------|------|
| `build.gradle` | 该模组的 Gradle 构建配置 |
| `src/main/java/com/civilizationera/tech/` | Java 源码主目录 |
| `TechResearch.java` | 模组主类 |
| `item/TechItems.java` | 物品注册（科技碎片、蓝图、研究台） |
| `research/ResearchManager.java` | 研究管理器（科技树、研究进度） |
| `src/main/resources/META-INF/mods.toml` | 模组描述文件 |

### 4. `barbarian-start/` - 蛮荒开局模组
**作用**：蛮荒时代限制、生火机制、陷阱系统、原始物品

| 子文件夹/文件 | 作用 |
|--------------|------|
| `build.gradle` | 该模组的 Gradle 构建配置 |
| `src/main/java/com/civilizationera/barbarian/` | Java 源码主目录 |
| `BarbarianStart.java` | 模组主类 |
| `item/BarbarianItems.java` | 物品注册（燧石打火器、原始陷阱、石棒、肉串等） |
| `fire/FireMakingManager.java` | 生火管理器 |
| `trap/TrapManager.java` | 陷阱管理器 |
| `food/BarbarianFoods.java` | 食物属性定义 |
| `src/main/resources/META-INF/mods.toml` | 模组描述文件 |

---

## 📁 整合包配置文件

### `config/` - 模组配置文件夹
**作用**：存放所有模组的配置文件，决定各个模组的具体行为参数

| 子文件夹 | 对应模组 | 配置内容 |
|----------|----------|----------|
| `ftbquests/` | FTB Quests | 任务系统配置、八纪元任务链数据 |
| `kubejs/` | KubeJS | KubeJS 脚本引擎配置 |
| `create/` | Create (机械动力) | 应力系统、世界生成、配方 |
| `mekanism/` | Mekanism (通用机械) | 能量倍率、矿物处理、世界生成 |
| `thermal/` | Thermal (热力系列) | RF 能量、机器速度、矿物生成 |
| `farmersdelight/` | Farmer's Delight (农夫乐事) | 食物腐烂、作物生长、兼容性 |
| `sereneseasons/` | Serene Seasons (静谧四季) | 季节时长、季节效果、冬季作物 |
| `ad_astra/` | Ad Astra (遥远星际) | 火箭燃料、氧气消耗、维度设置 |
| `terralith/` | Terralith | 生物群系大小、山脉高度、结构生成 |
| `waystones/` | Waystones (传送石) | 传送消耗、生成概率、冷却时间 |
| `ironfurnaces/` | Iron Furnaces (多级熔炉) | 熔炉速度、燃料效率、升级 |
| `pipez/` | Pipez (高效管道) | 管道速度、容量、损耗 |
| `storagedrawers/` | Storage Drawers (抽屉存储) | 抽屉容量、升级倍率 |
| `bountiful/` | Bountiful (悬赏任务) | 悬赏刷新、难度、奖励 |
| `yungsapi/` | YUNG's API | YUNG 系列结构生成通用配置 |

### `kubejs/` - KubeJS 脚本文件夹
**作用**：用 JavaScript 脚本修改游戏内容，实现时代锁等自定义功能

| 子文件夹 | 作用 |
|----------|------|
| `startup_scripts/` | 启动脚本，游戏加载时运行（注册新物品/方块等） |
| `server_scripts/` | 服务端脚本，处理游戏逻辑、事件、配方修改 |
| `client_scripts/` | 客户端脚本，处理 UI、JEI 显示、特效等 |

**主要脚本文件**：
- `era_config.js` - 纪元配置常量（8个纪元定义）
- `era_recipes.js` - 配方时代锁（控制哪些配方在哪个纪元解锁）
- `era_jei.js` - JEI 显示控制（未解锁的物品不显示）
- `era_events.js` - 纪元事件处理（推进条件、玩家登录、击杀掉落）

### `defaultconfigs/` - 默认服务器配置
**作用**：服务器首次生成时的默认配置，会自动复制到世界存档中

| 文件 | 作用 |
|------|------|
| `server.properties` | 服务器主配置（游戏模式、难度、视距等） |

---

## 📁 CurseForge 整合包

### `curseforge-pack/` - CurseForge 格式整合包
**作用**：标准的 CurseForge 整合包格式，可以直接导入启动器

| 文件/文件夹 | 作用 |
|-------------|------|
| `manifest.json` | CurseForge 清单文件（模组ID列表，启动器据此自动下载） |
| `modlist.html` | 模组列表网页版（可视化查看所有模组） |
| `README.md` | 整合包说明 |
| `overrides/` | 覆盖文件，导入时会覆盖到对应位置 |

#### `overrides/` 子文件夹
| 文件夹 | 覆盖到游戏中的位置 | 作用 |
|--------|-------------------|------|
| `config/` | `.minecraft/config/` | 模组配置文件 |
| `kubejs/` | `.minecraft/kubejs/` | KubeJS 脚本 |
| `defaultconfigs/` | `.minecraft/defaultconfigs/` | 默认世界配置 |
| `resourcepacks/` | `.minecraft/resourcepacks/` | 资源包（汉化包） |

#### `resourcepacks/CivilizationEra-Chinese-Pack/` - 汉化资源包
**作用**：为主要模组提供中文汉化

| 子文件夹 | 对应模组汉化 |
|----------|-------------|
| `assets/civilization_core/lang/` | 文明核心模组 |
| `assets/faction_economy/lang/` | 势力与经济模组 |
| `assets/tech_research/lang/` | 科技研究模组 |
| `assets/barbarian_start/lang/` | 蛮荒开局模组 |
| `assets/ftbquests/lang/` | FTB 任务 |
| `assets/jei/lang/` | JEI 物品管理器 |
| `assets/jade/lang/` | Jade 信息显示 |
| `assets/create/lang/` | 机械动力 |
| `assets/mekanism/lang/` | 通用机械 |
| `assets/thermal/lang/` | 热力膨胀 |
| `assets/farmersdelight/lang/` | 农夫乐事 |
| `assets/sereneseasons/lang/` | 静谧四季 |
| `assets/ad_astra/lang/` | 遥远星际 |
| `assets/ae2/lang/` | 应用能源2 |
| `assets/immersiveengineering/lang/` | 沉浸工程 |
| `assets/alexsmobs/lang/` | Alex 的生物 |
| `assets/mowziesmobs/lang/` | Mowzie 的怪物 |
| `assets/terralith/lang/` | Terralith 生物群系 |

---

## 📁 其他

### `mods/` - 模组文件夹
**作用**：存放模组 jar 文件的说明。**注意：由于版权原因，实际模组文件不在这里，请根据 `mods/README.md` 中的链接自行下载**

| 文件 | 作用 |
|------|------|
| `README.md` | 完整的模组下载清单，包含每个模组的下载链接和说明 |

### `config-pack/` - 配置文件包
**作用**：纯配置文件的打包版本，方便单独更新配置

### 根目录的 zip 文件
| 文件名 | 作用 |
|--------|------|
| `CivilizationEra-Modpack-1.0.0.zip` | 完整的 CurseForge 整合包，可直接导入启动器 |
| `CivilizationEra-Config-Pack-1.0.0.zip` | 仅配置文件包，用于更新配置 |

---

## 🔧 常用操作指南

### 如何编译自创模组？
```bash
./gradlew build
# 编译产物在各模块的 build/libs/ 目录
```

### 如何运行游戏测试？
```bash
./gradlew :civilization-core:runClient
```

### 如何安装整合包？
1. 下载 `CivilizationEra-Modpack-1.0.0.zip`
2. 用启动器（CurseForge/Prism/HMCL）导入
3. 等待自动下载所有模组
4. 启动游戏，在资源包设置中启用汉化包

### 如何只更新配置？
1. 下载 `CivilizationEra-Config-Pack-1.0.0.zip`
2. 解压到 `.minecraft/` 目录覆盖
3. 重启游戏即可

---

## 📝 版本信息

- **Minecraft 版本**: 1.20.1
- **Forge 版本**: 47.3.0
- **Java 版本**: 17
- **Gradle 版本**: 8.x
- **整合包版本**: 1.0.0
