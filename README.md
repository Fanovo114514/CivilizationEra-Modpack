# 文明纪元 (Civilization Era)

> Minecraft Forge 1.20.1 整合包

从野人开始，经历八个纪元，见证文明的诞生与发展。融合自动化闯关、碎片化科技树、经济驱动、势力博弈的大型整合包。

## 特性

- 🌍 **八大纪元**：蛮荒 → 原始 → 农耕 → 铁器 → 蒸汽 → 电气 → 信息 → 星际
- ⚙️ **时代锁系统**：每个纪元解锁不同的物品和配方，渐进式游戏体验
- 🏛️ **六大势力**：农庄联盟、矿业公会、工业财团、商人商会、学术院、地下黑市
- 💰 **经济系统**：动态市场、势力交易、投资建厂
- 🔬 **科技研究**：碎片化科技树、蓝图系统、研究台
- 👹 **怪物进化**：从野兽级到异星级，怪物随纪元进化
- 📱 **跨端支持**：PC + 手机端均可游玩

## 项目结构

```
CivilizationEra/
├── civilization-core/        # 文明核心模组
│   ├── src/
│   │   └── main/java/com/civilizationera/core/
│   │       ├── CivilizationCore.java    # 主类
│   │       ├── era/                     # 时代系统
│   │       ├── item/                    # 物品注册
│   │       └── capability/              # 玩家能力系统
│   ├── build.gradle
│   └── src/main/resources/META-INF/mods.toml
├── faction-economy/           # 势力与经济模组
│   └── src/main/java/com/civilizationera/faction/
│       ├── FactionEconomy.java
│       ├── faction/            # 势力系统
│       └── economy/            # 经济系统
├── tech-research/              # 科技研究模组
│   └── src/main/java/com/civilizationera/tech/
│       ├── TechResearch.java
│       ├── item/               # 科技物品
│       └── research/           # 研究系统
├── barbarian-start/            # 蛮荒开局模组
│   └── src/main/java/com/civilizationera/barbarian/
│       ├── BarbarianStart.java
│       ├── item/               # 蛮荒物品
│       ├── fire/               # 生火系统
│       └── trap/               # 陷阱系统
├── kubejs/                     # KubeJS 脚本
│   ├── startup_scripts/        # 启动脚本
│   ├── server_scripts/         # 服务端脚本
│   └── client_scripts/         # 客户端脚本
├── config/                     # 模组配置
│   └── ftbquests/              # FTB 任务配置
│       └── quests/chapters/    # 八纪元任务链
├── defaultconfigs/             # 默认服务器配置
├── build.gradle                # 根 Gradle 配置
├── settings.gradle             # 项目设置
├── gradle.properties           # Gradle 属性
├── manifest.json               # 整合包清单
└── README.md                   # 本文件
```

## 八纪元体系

| 纪元 | 名称 | 核心内容 | 对应模组 |
|------|------|----------|----------|
| 1 | 蛮荒 | 徒手生存、学会生火 | Terralith |
| 2 | 原始 | 木制工具、工作台、熔炉 | Starter Kit |
| 3 | 农耕 | 铜器、青铜器、农作物、畜牧 | Farmer's Delight 系列 |
| 4 | 铁器 | 铁器、钢器、运输、势力系统 | VillagersPlus 等 |
| 5 | 蒸汽 | 蒸汽动力、自动化、铁路 | Create、Immersive Engineering |
| 6 | 电气 | 电力系统、电子元件、能源管理 | Mekanism、Thermal |
| 7 | 信息 | 计算机、全自动化、网络系统 | Logistic Pipes 2 |
| 8 | 星际 | 太空探索、外星采矿、终极目标 | Ad Astra |

## 核心创新系统

### 1. 时代锁系统
- 控制每个纪元可用的配方和物品
- JEI 渐进显示（只显示当前及已解锁纪元的物品）
- 前纪元核心目标未完成不解锁下一纪元
- 用 KubeJS 辅助配方控制

### 2. 势力系统
六大势力各有特色：
- **农庄联盟** - 农业/友善 - 售卖种子和农业图纸
- **矿业公会** - 采矿/中立 - 售卖矿石和采矿工具
- **工业财团** - 制造/竞争 - 售卖机器和工业配方
- **商人商会** - 贸易/友善 - 全品类买卖，价格最公道
- **学术院** - 研究/神秘 - 售卖科技碎片和蓝图
- **地下黑市** - 灰产/敌对 - 高价稀有物品和违禁品

### 3. 经济系统
- 基础经济：产品卖给势力 NPC 换货币
- 市场波动：商品周期性涨跌
- 投资：购买地契、建设工厂、雇佣 NPC 工人

### 4. 科技碎片系统
- 遗迹探索获取蓝图碎片
- 加入势力解锁对应科技线
- 碎片化科技树，玩家发展路线可完全不同

### 5. 怪物进化系统
- 蛮荒→野兽级（数量多）
- 原始→变异级（特殊能力）
- 农耕→精英级（小 Boss）
- 铁器→骑士级（护甲/武器/战术）
- 蒸汽→机械级（半机械怪物）
- 电气→电子级（电磁攻击）
- 信息→智能级（利用玩家设施）
- 星际→异星级（终极 Boss）

### 6. 蛮荒开局系统
- 禁用合成台/熔炉/工具台
- 只能徒手/捡石头
- 食物只能生吃
- 增加怪物密度

## 开发指南

### 环境要求
- Java 17
- Gradle 8.x
- Minecraft Forge 1.20.1 (47.3.0)

### 构建项目

```bash
# 构建所有模组
./gradlew build

# 构建单个模组
./gradlew :civilization-core:build

# 运行游戏客户端
./gradlew :civilization-core:runClient
```

### 添加新的纪元物品

1. 在对应模组的 `item/` 目录注册物品
2. 在 `kubejs/server_scripts/era_recipes.js` 中配置配方解锁
3. 在 `kubejs/client_scripts/era_jei.js` 中配置 JEI 显示
4. 在 FTB Quests 中添加相关任务

### 配置 KubeJS 脚本

KubeJS 脚本位于 `kubejs/` 目录下：
- `startup_scripts/` - 游戏启动时加载，用于注册新物品/方块
- `server_scripts/` - 服务端脚本，处理游戏逻辑、事件
- `client_scripts/` - 客户端脚本，处理 UI、JEI 等

## 模组清单

当前整合包包含约 **63** 个模组（59 个现成模组 + 4 个自创模组）。

详细清单请查看 [manifest.json](./manifest.json)。

## 下载来源提示

- **Modrinth**: modrinth.com （大部分模组在此）
- **CurseForge**: curseforge.com
- **mcmod.cn**: 中文百科/讨论

## 待完成内容

- [ ] 自创模组详细 Java 代码实现
- [ ] KubeJS 时代锁脚本完善
- [ ] 具体 FTB 任务大纲细化
- [ ] 模组配置调优
- [ ] 手机端适配方案和兼容性测试
- [ ] 整合包发布结构完善

## 许可证

本项目仅供学习交流使用。

## 致谢

感谢所有为 Minecraft 模组开发做出贡献的开发者们！
