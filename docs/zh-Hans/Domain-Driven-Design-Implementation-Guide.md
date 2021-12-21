# 實現領域驅動設計

## 總述

本文是實現領域驅動設計(DDD)的**實用指南**.雖然在實現中依賴了ABP框架,但是本文中的概念,理論和設計模式同樣適用於其它型別的專案,不僅限於.Net專案.

### 目標

本文的目標是:

* **介紹並解釋**DDD的架構,概念,原理及構建.
* **解釋**ABP框架的分層架構及解決方案結構.
* 透過**案例**,介紹實現DDD的一些**規則**及最佳實踐.
* 展示**ABP框架**為DDD的實現提供了哪些基礎設施.
* 最後,基於軟體開發**最佳實踐**和我們的經驗提供**建議**來建立一個**可維護的程式碼庫**.

### 簡單的程式碼

> **踢足球**非常**簡單**,但是**踢簡單的足球**卻**非常難**.&mdash; <cite>約翰·克魯伊夫(Johan Cruyff)</cite>

在編碼的世界中,引用此名言:

> **寫程式碼**非常**簡單**,但是**寫簡單的程式碼**卻**非常難** &mdash; <cite>???</cite>

在本文中,我們將介紹一些容易實現的規則.

隨著**應用程式的變化**,有時候,為了節省開發時間會**違反一些本應遵守的規則**,使得程式碼變得**複雜**且難以維護.短期來看確實節省了開發時間,但是後期可能需要花費更多的時間為之前的偷懶而**買單**.**無法對原有的程式碼進行維護**,導致大量的邏輯都需要進行**重寫**.

如果你**遵循規則並按最佳實踐的方式**進行編碼,那麼你的程式碼將易於維護,你的業務邏輯將**更快的滿足**需求的變化.

## 什麼是領域驅動設計?

領域驅動設計(DDD)是一種將實現與**持續進化**的模型連線在一起來滿足**複雜**需求的軟體開發方法.

DDD適用於**複雜領域**或**較大規模**的系統,而不是簡單的CRUD程式.它著重與**核心領域邏輯**,而不是基礎架構.這樣有助於構建一個**靈活**,模組化,**可維護**的程式碼庫.

### OOP & SOLID

實現DDD高度依賴面對物件程式設計思想(OOP)和[SOLID](https://zh.wikipedia.org/wiki/SOLID_(%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E8%AE%BE%E8%AE%A1))原則.事實上,DDD已經**實現**並**延伸**了這些原則,因此,**深入瞭解**OOP和SOLID對實施DDD十分有利.

### DDD分層與整潔架構

基於DDD的架構分為四個基礎層

![domain-driven-design-layers](images/domain-driven-design-layers.png)

**業務邏輯**分為兩層,分別為 *領域(Domain)* 層和 *應用(Application)* 層,它們包含不同型別的業務邏輯.

* **領域層**:只實現領域業務邏輯,與用例無關.
* **應用層**:基於領域層來實現滿足用例的業務邏輯.用例可以看作是使用者介面(UI)或外部應用程式的互動.
* **展現層**:包含應用程式的UI元素.
* **基礎設施層**:透過對第三方庫的整合或抽象,來滿足其它層的非核心業務邏輯的實現.

同樣的分層架構也可以如下圖所示:被稱為 **整潔架構**, 又或者稱為 **洋蔥架構**:

![domain-driven-design-clean-architecture](images/domain-driven-design-clean-architecture.png)

在整潔架構中,**每層只依賴內部的層**,獨立的層在圓圈的最中心,也就是領域層.

### 核心構建組成

DDD的關注點在**領域層**和**應用層**上,而展現層和基礎設施層則視為*細節*(這個詞原文太抽象,自己體會吧),業務層不應依賴它們.

這並不意味著展現層和基礎設施層不重要.它們非常重要,但*UI框架* 和 *資料庫提供程式* 需要你自己定義規則和總結最佳實踐.這些不在DDD的討論範圍中.

本節將介紹領域層和應用層的基本構建元件.

#### 領域層構建組成

* **實體(Entity)**: [實體](Entities.md)是種領域物件,它有自己的屬性(狀態,資料)和執行業務邏輯的方法.實體由唯一識別符號(Id)表示,不同ID的兩個實體被視為不同的實體.
* **值物件(Value Object)**: [值物件](Value-Objects.md)是另外一種型別的領域物件,使用值物件的屬性來判斷兩個值物件是否相同,而非使用ID判斷.如果兩個值物件的屬性值全部相同就被視為同一物件.值物件通常是不可變的,大多數情況下它比實體簡單.
* **聚合(Aggregate) 和 聚合根(Aggregate Root)**: [聚合](Entities.md)是由**聚合根**包裹在一起的一組物件(實體和值物件).聚合根是一種具有特定職責的實體.
* **倉儲(Repository)** (介面): [倉儲](Repositories.md)是被領域層或應用層呼叫的資料庫持久化介面.它隱藏了DBMS的複雜性,領域層中只定義倉儲介面,而非實現.
* **領域服務(Domain Service)**: [領域服務](Domain-Services.md)是一種無狀態的服務,它依賴多個聚合(實體)或外部服務來實現該領域的核心業務邏輯.
* **規約(Specification)**: [規約](Specifications.md)是一種**強命名**,**可重用**,**可組合**,**可測試**的實體過濾器.
* **領域事件(Domain Event)**: [領域事件](Event-Bus.md)是當領域某個事件發生時,通知其它領域服務的方式,為了解耦領域服務間的依賴.

#### 應用層構建組成

* **應用服務(Application Service)**: [應用服務](Application-Services.md)是為實現用例的無狀態服務.展現層呼叫應用服務獲取DTO.應用服務呼叫多個領域服務實現用例.用例通常被視為一個工作單元.
* **資料傳輸物件(DTO)**: [DTO](Data-Transfer-Objects.md)是一個不含業務邏輯的簡單物件,用於應用服務層與展現層間的資料傳輸.
* **工作單元(UOW)**: [工作單元](Unit-Of-Work.md)是事務的原子操作.UOW內所有操作,當成功時全部提交,失敗時全部回滾.

## 實現領域驅動:重點

### .NET解決方案分層

下圖是使用[ABP的啟動模板](Startup-Templates/Application.md)建立的解決方案:

![domain-driven-design-vs-solution](images/domain-driven-design-vs-solution.png)

解決方案名為 `IssueTracking` ,它包含多個專案.該解決方案出於**DDD原則**及**開發**和**部署**的實踐來進行分層.後面會在各小節中介紹解決方案中的專案.

> 在使用啟動模板時,如果選擇了其它型別的UI或*資料庫提供程式*,解決方案的結構會略有不同.但是領域層和應用層是一樣的,這才是DDD的重點.如果你想了解有關解決方案的更多資訊,請參見[啟動模板](Startup-Templates/Application.md).

#### 領域層

領域層分為兩個專案:

* `IssueTracking.Domain`是**領域層中必需**的,它包含之前介紹的**構建組成**(實體,值物件,領域服務,規約,倉儲介面等).
* `IssueTracking.Domain.Shared`是領域層中**很薄的專案**,它只包含領域層與其它層共享的資料型別的定義.例如,列舉,常量等.

#### 應用層

應用層也被分為了兩個專案:

* `IssueTracking.Application.Contracts`包含**介面**的定義及介面依賴的**DTO**,此專案可以被展現層或其它客戶端應用程式引用.
* `IssueTracking.Application`是**應用層中必需**的,它實現了`IssueTracking.Application.Contracts`專案中定義的介面.

#### 展現層

* `IssueTracking.Web`是一個ASP.NET Core MVC / Razor Pages應用程式.它是提供UI元素及API服務的可執行程式.

> ABP框架還支援其它型別的UI框架,包括[Angular](UI/Angular/Quick-Start.md)和[Blazor](UI/Blazor/Overall.md).當選擇*Angular*或*Blazor*時,解決方案不會有`IssueTracking.Web`專案.但是會新增`IssueTracking.HttpApi.Host`在解決方案中,此專案會提供HTTP API供UI呼叫.

#### 遠端服務層

* `IssueTracking.HttpApi`包含了HTTP API的定義.它通常包含*MVC Controller* 和 *Model*(如果有).因此,你可以在此專案中提供HTTP API.

> 大多數情況下,透過使用*API Controller* 包裝應用服務,供客戶端遠端呼叫.ABP框架的[API自發現系統](API/Auto-API-Controllers.md)可以自動將應用服務公開為API,因此,通常不需要在此專案中再建立Controller.出於需要手動新增額外Controller的情況,也包含在模板解決方案中.

* `IssueTracking.HttpApi.Client`當C#客戶端應用程式需要呼叫`IssueTracking.HttpApi`的API時,這個專案非常有用.客戶端程式僅需引用此專案就可以透過依賴注入方式,遠端呼叫應用服務.它是透過ABP框架的[動態C#客戶端API代理系統](API/Dynamic-CSharp-API-Clients.md)來實現的.

> 在解決方案資料夾`test`下,有一個名為`IssueTracking.HttpApi.Client.ConsoleTestApp`的控制檯程式.它演示瞭如何使用`IssueTracking.HttpApi.Client`專案來遠端呼叫應用程式公開的API.因為只是演示,你可以刪除此專案,再或者你認為`IssueTracking.HttpApi`不需要,同樣可以刪除.

#### 基礎設施層

你可能只建立一個基礎設施專案來完成所有抽象類的定義及外部類的整合,又或者為不同的依賴建立多個不同的專案.

我們建議採用一種平衡的方法:為主要的依賴的庫(例如 Entity Framework Core)建立一個獨立的專案,為其它的依賴庫建立一個公共的基礎設施專案.

ABP的啟動解決方案中包含兩個用於整合Entity Framework Core的專案:

* `IssueTracking.EntityFrameworkCore`是必需的,因為需要整合*EF Core*.應用程式的`資料庫上下文(DbContext)`,資料庫物件對映,倉儲介面的實現,以及其它與*EF Core*相關的內容都位於此專案中.
* `IssueTracking.EntityFrameworkCore.DbMigrations`是管理Code First方式資料庫遷移記錄的特殊專案.此專案定義了一個獨立的`DbContext`來追蹤遷移記錄.只有當新增一個新的資料庫遷移記錄或新增一個新的[應用模組](Modules/Index.md)時,才會使用此專案,否則,其它情況無需修改此專案內容.

> 你可能想知道為什麼會有兩個EF Core專案,主要是因為[模組化](Module-Development-Basics.md).每個應用模組都有自己獨立的`DbContext`,你的應用程式也有自己`DbContext`.`DbMigrations`專案包含**合併**所有模組遷移記錄的**單個遷移路徑**.雖然大多數情況下你無需過多瞭解,但也可以檢視[EF Core遷移](Entity-Framework-Core-Migrations.md)瞭解更多資訊. 

#### 其它專案

另外還有一個專案`IssueTracking.DbMigrator`,它是一個簡單的控制檯程式,用來執行資料庫遷移,包括**初始化**資料庫及建立**種子資料**.這是一個非常實用的應用程式,你可以在開發環境或生產環境中使用它.

### 專案間的依賴關係

下圖展示瞭解決方案中專案間的依賴關係(有些專案比較簡單就未展示):

![domain-driven-design-project-relations](images/domain-driven-design-project-relations.png)

之前已介紹了這些專案.現在,我們來解釋依賴的原因:

* `Domain.Shared` 所有專案直接或間接依賴此專案.此專案中的所有型別都可以被其它專案所引用.
* `Domain` 僅依賴`Domain.Shared`專案,因為`Domain.Shared`本就屬於領域層的一部分.例如,`Domain.Shared`專案中的列舉型別 `IssueType` 被`Domain`專案中的`Issue`實體所引用.
* `Application.Contracts` 依賴`Domain.Shared`專案,可以在DTO中重用`Domain.Shared`中的型別.例如,`Domain.Shared`專案中的列舉型別 `IssueType` 同樣被`Contracts`專案中的`CreateIssueDto`DTO所引用.
* `Application` 依賴`Application.Contracts`專案,因為此專案需要實現應用服務的介面及介面使用的DTO.另外也依賴`Domain`專案,因為應用服務的實現必須依賴領域層中的物件.
* `EntityFrameworkCore` 依賴`Domain`專案,因為此專案需要將領域物件(實體或值物件)對映到資料庫的表,另外還需要實現`Domain`專案中的倉儲介面.
* `HttpApi` 依賴`Application.Contracts`專案,因為Controllers需要注入應用服務.
* `HttpApi.Client` 依賴`Application.Contracts`專案,因為此專案需要是使用應用服務.
* `Web` 依賴`HttpApi`專案,因為此專案對外提供HTTP APIs.另外Pages或Components 需要使用應用服務,所以還間接依賴了`Application.Contracts`專案

#### 虛線依賴

你在上圖中會發現用虛線表示了另外兩個依賴.`Web`專案依賴了 `Application` and `EntityFrameworkCore`,理論上`Web`不應該依賴這兩個專案,但實際上依賴了.原因如下:

`Web`是最終的執行程式,是負責託管Web的宿主,它在執行時需要**應用服務和倉儲的實現類**.

這種依賴關係的設計,可能會讓你有機會在展現層直接使用到EF Core的物件,**應該嚴格禁止這樣的做法**.如果想在解決方案分層上規避這種問題,有下面兩種方式,相對複雜一些:

* 將`Web`專案型別改為razor類庫,並建立一個新專案,比如`Web.Host`,`Web.Host`依賴`Web`,`Application`,`EntityFrameworkCore`三個專案,並作為Web宿主程式執行.注意,不要寫任何與UI相關的程式碼,只是作為**宿主執行**.
* 在`Web`專案中移除對`Application`和`EntityFrameworkCore`的引用,`Web`在啟動時,再動態載入程式集`IssueTracking.Application.dll`和`IssueTracking.EntityFrameworkCore.dll`.可以使用ABP框架的[外掛模組](PlugIn-Modules.md)來動態載入程式集.

### DDD模式的應用程式執行順序

下圖展示了基於DDD模式下的Web應用程式執行順序:

![](images/domain-driven-design-web-request-flow.png)

* 通常由UI(用例)發起一個HTTP請求到伺服器.
* 由展現層(或分散式服務層)中的一個*MVC Controller*或*Razor Page Handler*處理請求,在這個階段可以執行一些AOP邏輯([授權](Authorization.md),[驗證](Validation.md),[異常處理](Exception-Handling.md)等),*MVC Controller*或*Razor Page Handler*呼叫注入的應用服務介面,並返回其呼叫後的結果(DTO)..
* 應用服務使用領域層的物件(實體,倉儲介面,領域服務等)來實現UI(用例)互動.此階段同樣可以執行一些AOP邏輯(授權,驗證等).應用服務中的每個方法應該是一個[工作單元](Unit-Of-Work.md),代表它是一次原子性操作.

跨域問題大多數由**ABP框架自動實現**,通常不需要為此額外編碼.

### 通用原則

在詳細介紹之前,我們先來看一些DDD的總體原則.

#### 資料庫提供程式 / ORM 獨立原則

領域層和應用層應該與*資料庫提供程式 / ORM*無關.領域層和應用層僅依賴倉儲介面,並且倉儲介面不依賴特定的ORM物件.

原因如下:

1. 未來領域層或應用層的基礎設施會發生改變,例如,需要支援另外一種資料庫型別,因此需要保持**領域層或應用層的基礎設施是獨立的**.
2. 將基礎設施的實現隱藏在倉儲中,使得領域層或應用層更**專注於業務邏輯程式碼**.
3. 可以透過模擬倉儲介面,使得自動化測試更為方便.

> 關於此原則, `EntityFrameworkCore`專案只被啟動程式專案所引用,解決方案中其它專案均未引用.

##### 關於資料庫獨立原則的討論

**原因1**會非常影響你**領域物件的建模**(特別是實體間的關係)及**應用程式的程式碼**.假如,開始選擇了關係型資料庫,並使用了[Entity Framework Core](Entity-Framework-Core.md),後面嘗試切換到[MongoDB](MongoDB.md),那麼 **EF Core 中一些非常用的特性**你就不能使用了,例如:

* 無法使用[變更追蹤](https://docs.microsoft.com/zh-cn/ef/core/querying/tracking) ,因為*MongoDB provider*沒有提供此功能,因此,你始終需要顯式的更新已變更的實體.
* 無法在不同的聚合間使用[導航屬性](https://docs.microsoft.com/zh-cn/ef/core/modeling/relationships),因為文件型資料庫是不支援的.有關更多資訊,請參見"規則:聚合間僅透過Id關聯".

如果你認為這些功能對你很**重要**,並且你永遠都不會**離開** *EF Core*,那麼我們認為你可以忽略這一原則.假如你在設計實體關係時使用了*EF Core*,你甚至可以在應用層引用*EF Core Nuget*包,並直接使用非同步的LINQ擴充套件方法,例如 `ToListAsync()`(有關更多資訊,請參見[倉儲](Repositories.md)文件中的*IQueryable*和*Async Operations*).

但是我們仍然建議採用倉儲模式來隱藏基礎設施中實現過程.

#### 展現層技術無關原則

展現層技術(UI框架)時現代應用程式中最多變的部分之一.**領域層和應用層**應該對展現層所採用的技術或框架**一無所知**.使用ABP啟動模板就非常容易實現此原則.

在某些情況下,你可能需要在應用層和展現層中寫重複的邏輯,例如,引數驗證和授權檢查.展現層檢查出於**使用者體驗**,應用層或領域層檢查出於**資料安全性**和**資料完整性**.

#### 關注狀態的變化,而不是報表/查詢

DDD關注領域物件的**變化和相互作用**,如何建立或修改一個具有資料**完整性,有效性**,符合**業務規則**的實體物件.

DDD忽略**領域物件的資料展示**,這並不意味著它們並不重要,如果應用程式沒有精美的看板和報表,誰會願意用呢?但是報表是另外一個討論話題,你可以透過使用SQL Server報表功能或ElasticSearch來提供資料展示,又或者使用最佳化後的SQL查詢語句,建立資料庫索引或儲存過程.唯一的原則是不要將這些內容混入領域的業務邏輯中.

## 實現領域驅動:構建組成

這是本指南的重要部分,我們將透過示例介紹並解釋一些**明確的規則**,在實現領域驅動設計時,你可以遵循這些規則並將其應用於解決方案中.

### 領域

示例中會使用一些概念,這些概念在Github中被使用,例如, `Issue`(問題), `Repository`(倉庫), `Label`(標籤) 和`User`(使用者).下圖中展示了一些聚合,聚合根,實體,值物件以及它們之間的關係:

![domain driven design example schema](images/domain-driven-design-example-domain-schema.png)

**問題聚合** 由`Issue` 聚合根,及其包含的 `Comment` 和`IssueLabel` 集合組成.我們將重要討論 `Issue` 聚合根:

![domain-driven-design-issue-aggregate-diagram](images/domain-driven-design-issue-aggregate-diagram.png)

### Aggregates

如前所述, [聚合](Entities.md)是由**聚合根**包裹在一起的一組物件(實體和值物件).本節將介紹於聚合的有關原理和規則.

> 後面的文件中,我們將使用 *實體* 替代 *聚合根* 或 *子集合實體* ,除非我們明確指明使用 *聚合根* 或 *子集合實體* .

#### 聚合 / 聚合根 原則

##### 業務規則

實體負責實現與其自身屬性相關的業務規則.同時*聚合根實體*還負責它們的子集合實體.

聚合應該透過領域規則和約束來保證自身的**完整性**和**有效性**.這意味著,實體與DTO是不同的,實體應該比DTO多了些**實現業務邏輯的方法**.我們應該儘可能地在實體上實現業務規則.

##### 獨立單元

應該在一個獨立的單元中完成**一個聚合的獲取及儲存**,包括自身屬性及其子集合.假如我們需要在`Issue`中新增一個新的`Comment`,步驟如下:

* 從資料庫中獲取一個 `Issue` 物件,包括所有子集合(`Comments`和`IssueLabels`).
* 使用 `Issue` 實體上的新增新`Comment`的方法,例如 `Issue.AddComment(...);`.
* 在資料庫的單次操作中完成整個 `Issue`物件(包括子集合)的儲存.

對於在關係型資料庫上用過 **EF Core** 的開發人員會認為,獲取`Issue`的同時載入子集合沒有必要並且還影響效能.為什麼不使用SQL語句`Insert`來直接插入記錄呢?

這樣做的原因是我們需要執行業務規則來保證資料的一致性和完整性.假如有一個業務規則:"使用者不能對已鎖定的問題進行評論".那如何在不查詢資料庫的情況下,獲取問題是否已被鎖定?所以,只有關聯的物件都被載入了的時候,我們才可以執行業務規則.

另外,使用**MongoDB**的開發人員就認為此原則很好理解.在MongoDB中,聚合物件(包含子集合)會被儲存到一個`collection`中.因而,無需任何其它配置,就可以實現查詢一個聚合,同時所有子物件.

ABP框架有助於你實現這一原則

**例子: 問題追加評論**

````csharp
public class IssueAppService : ApplicationService, IIssueAppService
{
    private readonly IRepository<Issue, Guid> _issueRepository;

    public IssueAppService(IRepository<Issue, Guid> issueRepository)
    {
        _issueRepository = issueRepository;
    }

    [Authorize]
    public async Task CreateCommentAsync(CreateCommentDto input)
    {
        var issue = await _issueRepository.GetAsync(input.IssueId);
        issue.AddComment(CurrentUser.GetId(), input.Text);
        await _issueRepository.UpdateAsync(issue);
    }
}
````

透過`_issueRepository.GetAsync`方法來獲取`Issue`物件時,預設就已經載入了所有子集合.對於MongoDB很簡單,EF Core 則需要額外配置,一旦配置,ABP倉儲類會自動處理.`_issueRepository.GetAsync`方法還有個可選引數`includeDetails`,可以傳`false`,手動禁止載入子集合.

> 如何配置及替代方案,請參考[EF Core document](Entity-Framework-Core.md)的*載入關聯實體*  章節.

`Issue.AddComment`接收兩個引數,分別是`userId`和`text`,再執行自己的業務規則,最終將評論新增到`Issue`的評論集合中.

最後,我們使用`_issueRepository.UpdateAsync`方法,將物件儲存到資料庫中.

> EF Core 具有**變更追蹤**的功能,因此,不需要呼叫`_issueRepository.UpdateAsync`方法.ABP的工作單元會再方法結束時,自動執行`DbContext.SaveChanges()`的.如果使用MongoDB則需要顯式手動呼叫.
>
> 因此,當需要額外編寫倉儲層的實現,應該在實體變化時始終呼叫 `UpdateAsync` 方法.

##### 事務邊界

通常認為一個聚合就是一個事務邊界.如果用例只涉及單個聚合,那麼讀取及修改就是一個操作單元.對聚合內所有物件的修改都將作為原子操作一起儲存,無需顯式建立資料庫事務.

但是,實際上,可能需要在一個用例中更改**多個聚合物件的例項**,並且還要求建立事務來保證**原子更新**和**資料一致性**.因此,ABP框架提供了為每個用例(應用服務中的方法),可以建立顯式事務的功能.有關更多資訊,請參見文件[工作單元](Unit-Of-Work.md).

##### 序列化

一個聚合(包含聚合根及子集合)可以被序列化或反序列化.例如,MongoDB在儲存物件到資料庫時,會將聚合序列化為JSON檔案,讀取時再進行反序列化.

> 使用關係型資料庫+ORM時,這個原則不是必須的,但是,這是領域驅動設計的重要實踐.

以下規則遵循序列化原則

#### 聚合/聚合根規則及最佳實踐

以下規則是遵循上述原則.

##### 聚合間只通過ID相互引用

聚合應該只引用其它聚合的ID,也就是說,不允許定義導航屬性關聯至其它聚合.

* 該規則遵循了可序列化原則.
* 該規則還可以避免不同聚合彼此間的相互操作以及業務邏輯的暴露.

下圖中,可以看到兩個聚合根,`GitRepository` 和`Issue` :

![domain-driven-design-reference-by-id-sample](images/domain-driven-design-reference-by-id-sample.png)

* `GitRepository` 不應該包含 `Issue`的集合,因為`Issue`屬於不同的聚合.
* `Issue` 不應該包含導航屬性至 `GitRepository` .因為 `GitRepository`屬於不同的聚合.
* `Issue` 可以有 `RepositoryId` 的引用.

因此,若要獲取`Issue`關聯的 `GitRepository`物件,需要使用`Issue`的`RepositoryId`在資料庫中進行一次查詢.

###### 對於EF Core和關係型資料庫

MongoDB中不適合使用導航屬性或集合的,原因是:當前源聚合物件會被序列化為JSON,其中會儲存導航目標聚合的副本.

在使用EF Core在關係型資料庫上進行操作時,開發者可能認為此規則沒必要.但是我們認為這是一條非常重要的規則,有助於降**低領域的複雜性**減少風險.我們強烈建議遵守此規則.如果你確定要忽略此規則,請參見上面的"關於資料庫獨立原理的討論"章節.

##### 保持聚合儘量的小

保持聚合簡單而小巧是一個比較好的做法.因為聚合的讀取與儲存是一個整體,當處理較大物件時會出現效能問題,如下所示:

![domain-driven-design-aggregate-keep-small](images/domain-driven-design-aggregate-keep-small.png)

角色聚合包含`UserRole`值物件集合,方便查詢該角色下有哪些使用者.注意,`UserRole`不是聚合,並且也遵守了*聚合間只通過ID相互引用*的規則.但是在現實場景中,一個角色可能被給成千上萬個使用者,當從資料庫中載入一個角色時,會關聯載入數千個使用者物件,這裡會有 嚴重的效能問題.

反過來看,`User`也可以有`Roles` 集合,現實中一個使用者不會具有太多的角色,因此採用`User`關聯`Roles`這種方式比較合適.

當使用**非關係型資料庫時**,`User`和`Role` 同時都有關聯子集合,會出現另外一個問題.相同的記錄會被重複記錄在不同的集合中,並且難以保證資料一致性(需要新增記錄到`User.Roles`和`Role.Users`中)

因此,請根據以下注意事項來確定聚合的邊界:

* 同時被使用的物件.
* 查詢(讀取/儲存)效能和記憶體消耗.
* 資料完整性,有效性,一致性.

現實情況:

* 大多數聚合根**沒有子集合**.
* 子集合的數量控制在**100-150個**.如果集合數量超過150個,考慮將子物件改成聚合根.

##### 聚合根 / 實體的主鍵

* 聚合根通常具有唯一的識別符號ID (主鍵: PK).我們建議使用 `Guid`作為聚合根的主鍵型別. (原因請參見[Guid生成文件](Guid-Generation.md)).
* 聚合中的實體(非聚合根)可以使用聯合主鍵.

如圖所示:

![domain-driven-design-entity-primary-keys](images/domain-driven-design-entity-primary-keys.png)

* `Organization`有一個`Guid`的識別符號 (`Id`).
* `OrganizationUser`是一個子集合,使用 `OrganizationId` 和`UserId`作為聯合主鍵.

並不是所有的子集合的主鍵都是聯合主鍵,有些情況下,可以使用單獨的`Id`作為主鍵.

> 聯合主鍵實際上時關係型資料庫中的概念,因為子集合物件有與之對應的資料庫表,而表也要有主鍵.但是在非關係型資料庫中,無需為子集合實體定義主鍵,因為它們本身就已屬於一個聚合根.

##### 聚合根 / 實體的建構函式

建構函式是實體生命週期的開始被執行.以下是建構函式的編寫建議:

* 將實體的**必填屬性**作為建構函式引數,這樣可以建立一個**有效(符合規則)的實體**.另外,將非必填屬性作為建構函式的可選引數.
* 引數必須**檢查有效性**.
* 所有**子集合**物件必須被初始化.

**示例: `Issue` (聚合根) 建構函式**

````csharp
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace IssueTracking.Issues
{
    public class Issue : AggregateRoot<Guid>
    {
        public Guid RepositoryId { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public Guid? AssignedUserId { get; set; }
        public bool IsClosed { get; set; }
        public IssueCloseReason? CloseReason { get; set; } //enum

        public ICollection<IssueLabel> Labels { get; set; }

        public Issue(
            Guid id,
            Guid repositoryId,
            string title,
            string text = null,
            Guid? assignedUserId = null
            ) : base(id)
        {
            RepositoryId = repositoryId;
            Title = Check.NotNullOrWhiteSpace(title, nameof(title));
            
            Text = text;
            AssignedUserId = assignedUserId;
            
            Labels = new Collection<IssueLabel>();
        }

        private Issue() { /* for deserialization & ORMs */ }
    }
}
````

* `Issue` 透過建構函式的引數,對必填屬性進行賦值,而從建立一個有效的實體物件.
* 建構函式對引數進行**驗證**(`Check.NotNullOrWhiteSpace(...)`必填項為空,丟擲異常).
* 初始化子集合.在例項化`Issue`物件後,訪問 `Labels` ,不會出現空指標異常.
* 建構函式還將 `id`傳遞給父類,不要在建構函式內生成 `Guid`(參閱 [Guid生成](Guid-Generation.md)).
* 為ORM保留**私有的無參建構函式**.防止編寫程式碼時,意外使用了無參建構函式.

> 參見 [實體](Entities.md) 文件,瞭解更多使用ABP框架建立實體的資訊.

##### 實體屬性訪問器和方法

上面的示例中,我們在建構函式中對 `Title` 進行了非空檢查.但是開發人員可以再次對`Title`進行賦值.

如果我們使用**公開的屬性**,則無法在實體控制資料的**有效性**和**完整性**.建議:

* 如果某個屬性具有業務邏輯,則將該屬性的**setter**改為私有.
* 定義公開的方法來修改屬性.

**示例:提供方法修改屬性**

````csharp
using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace IssueTracking.Issues
{
    public class Issue : AggregateRoot<Guid>
    {
        public Guid RepositoryId { get; private set; } //Never changes
        public string Title { get; private set; } //Needs validation
        public string Text { get; set; } //No validation
        public Guid? AssignedUserId { get; set; } //No validation
        public bool IsClosed { get; private set; } //Should change with CloseReason
        public IssueCloseReason? CloseReason { get; private set; } //Should change with IsClosed

        //...

        public void SetTitle(string title)
        {
            Title = Check.NotNullOrWhiteSpace(title, nameof(title));
        }

        public void Close(IssueCloseReason reason)
        {
            IsClosed = true;
            CloseReason = reason;
        }

        public void ReOpen()
        {
            IsClosed = false;
            CloseReason = null;
        }
    }
}
````

* `RepositoryId` setter是私有的.建立後無法變更,業務規則不允許將已有的問題移到其它倉庫.
* `Title` setter是私有的.它的修改時需要加以驗證.
* `Text` 和 `AssignedUserId` setter 是公開的.因為業務規則允許它們為空或任意值.我們認為沒必要將它們改為私有的,如果將來業務發生變化,再將setter改為私有,並提供公開的方法進行修改.另外實體屬於領域層,不會直接暴露屬性給應用層(或其它層),目前將其公開不是什麼大問題.
* `IsClosed` 和 `IssueCloseReason` 它們是一組屬性.定義 `Close` 和 `ReOpen` 方法來同時對這兩個屬性進行賦值.這樣可以防止問題被無故關閉.

##### 業務邏輯與實體異常

對實體進行驗證,或執行業務邏輯時,通常需要丟擲異常:

* 領域中定義的**特定的異常**.
* 實體方法中**丟擲的異常**.

**示例**

````csharp
public class Issue : AggregateRoot<Guid>
{
    //...
    
    public bool IsLocked { get; private set; }
    public bool IsClosed { get; private set; }
    public IssueCloseReason? CloseReason { get; private set; }

    public void Close(IssueCloseReason reason)
    {
        IsClosed = true;
        CloseReason = reason;
    }

    public void ReOpen()
    {
        if (IsLocked)
        {
            throw new IssueStateException(
                "Can not open a locked issue! Unlock it first."
            );
        }

        IsClosed = false;
        CloseReason = null;
    }

    public void Lock()
    {
        if (!IsClosed)
        {
            throw new IssueStateException(
                "Can not open a locked issue! Unlock it first."
            );
        }

        IsLocked = true;
    }

    public void Unlock()
    {
        IsLocked = false;
    }
}
````

這裡有兩個業務規則:

* 已鎖定的問題無法重新開啟.
* 無法鎖定已開打的問題.

當違反業務規則時,`Issue` 會丟擲 `IssueStateException` 異常:

````csharp
using System;

namespace IssueTracking.Issues
{
    public class IssueStateException : Exception
    {
        public IssueStateException(string message)
            : base(message)
        {
            
        }
    }
}
````

丟擲異常會引發兩個問題:

1. 當異常發生時,**使用者**應該看到異常(錯誤)資訊嗎?如果需要看到,異常訊息如何實現本地化?   實體中無法注入[本地化](Localization.md)的 `IStringLocalizer` 介面.
2. 對於Web應用或HTTP API,應向客戶端返回什麼**HTTP狀態程式碼**.

ABP框架的 [異常處理](Exception-Handling.md) 可以解決上述問題.

**示例:使用異常編碼**

````csharp
using Volo.Abp;

namespace IssueTracking.Issues
{
    public class IssueStateException : BusinessException
    {
        public IssueStateException(string code)
            : base(code)
        {
            
        }
    }
}
````

* `IssueStateException` 繼承至 `BusinessException` .對於`BusinessException`的派生類,ABP框架預設返回的HTTP狀態碼是403 (預設是伺服器內部錯誤 狀態碼 500)
*  將`code` 作為Key,在本地化資源中查詢對應的文字.

現在,我們修改 `ReOpen` 方法:

````csharp
public void ReOpen()
{
    if (IsLocked)
    {
        throw new IssueStateException("IssueTracking:CanNotOpenLockedIssue");
    }

    IsClosed = false;
    CloseReason = null;
}
````

> 使用常量而不是魔法字串.

在本地化資原始檔中新增對應的記錄:

````json
"IssueTracking:CanNotOpenLockedIssue": "Can not open a locked issue! Unlock it first."
````

* 異常發生時,ABP將自動使用本地化訊息(基於當前語言).
* 異常編碼 (`IssueTracking:CanNotOpenLockedIssue` )會被髮送到客戶端.同樣可以以程式設計方式處理此異常.

> 你可以無需定義 `IssueStateException`,直接丟擲`BusinessException`異常.詳細資訊,參見[異常處理文件](Exception-Handling.md)

##### 實體中業務邏輯依賴外部服務時

僅依賴實體本身的屬性執行的業務規非常簡單.但是有時候,複雜的業務邏輯會**查詢資料庫**或使用[依賴注入](Dependency-Injection.md)中的其它服務,這該怎麼辦?注意:**實體是無法注入服務的**.

實現這種業務邏輯有兩種方式:

* 將依賴的服務以**方法的引數**,傳遞到實體的業務邏輯方法中.
* 定義一個**領域服務**.

領域服務我們後面再說.我們先看看在實體類中如何實現:

**示例:業務規則: 不允許將3個以上未解決的問題關聯到一個使用者**

````csharp
public class Issue : AggregateRoot<Guid>
{
    //...
    public Guid? AssignedUserId { get; private set; }

    public async Task AssignToAsync(AppUser user, IUserIssueService userIssueService)
    {
        var openIssueCount = await userIssueService.GetOpenIssueCountAsync(user.Id);

        if (openIssueCount >= 3)
        {
            throw new BusinessException("IssueTracking:ConcurrentOpenIssueLimit");
        }

        AssignedUserId = user.Id;
    }

    public void CleanAssignment()
    {
        AssignedUserId = null;
    }
}
````

* `AssignedUserId` 私有的屬性setter.此屬性只能透過`AssignToAsync` 和`CleanAssignment` 方法來修改.
* `AssignToAsync` 透過 `user.Id` 屬性獲取一個 `AppUser` 實體.
* `IUserIssueService` 是獲取使用者未解決問題的服務.
* `AssignToAsync` 當不滿足業務規則時丟擲異常.
* 最後,符合規則,就對屬性`AssignedUserId` 進行賦值.

這樣就解決了將問題關聯到使用者時,需要呼叫外部服務的問題,但是它也存在幾個問題:

* 實體**依賴了外部服務**,實體變得**複雜**.
* 實體呼叫變的複雜.在呼叫`AssignToAsync` 方法時還需要傳遞 `IUserIssueService` 服務.

實現這種業務邏輯另外一種方案,使用領域服務,後面將詳細說明.

### 倉儲

[倉儲](Repositories.md)是一個類集合的介面,它通常被領域層或應用層呼叫,負責訪問持久化系統(資料庫),讀取寫入業務物件(聚合).

倉儲的原則:

* 在**領域層**中定義倉儲介面,因為倉儲會被領域層或應用層呼叫,在**基礎設施層中實現**(*EntityFrameworkCore* 專案).
* 倉儲中**不要寫任何業務邏輯**.
* 倉儲介面不依賴 **資料庫提供程式 / ORM**.例如,不要在倉儲中返回 `DbSet` 型別,因為 `DbSet`是EF Core中的物件.
* **僅為聚合根定義倉儲**,非聚合根物件不要提供倉儲,因為子集合可以透過聚合根來進行持久化.

#### 倉儲中不要寫任何業務邏輯

我們經常不小心把業務邏輯編寫到了倉儲層.

**示例:從倉儲中獲取非活動的問題**

````csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace IssueTracking.Issues
{
    public interface IIssueRepository : IRepository<Issue, Guid>
    {
        Task<List<Issue>> GetInActiveIssuesAsync();
    }
}
````

`IIssueRepository`繼承至`IRepository<...>`介面,並新增一個新介面`GetInActiveIssuesAsync`.此倉儲為聚合根`Issue`提供查詢的實現.

````csharp
public class Issue : AggregateRoot<Guid>, IHasCreationTime
{
    public bool IsClosed { get; private set; }
    public Guid? AssignedUserId { get; private set; }
    public DateTime CreationTime { get; private set; }
    public DateTime? LastCommentTime { get; private set; }
    //...
}
````

(上面的屬性僅為了演示此示例)

原則要求倉儲不包含業務邏輯,上面的示例"**什麼是非活動的問題?**"這個屬於業務規則嗎?

````csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IssueTracking.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace IssueTracking.Issues
{
    public class EfCoreIssueRepository : 
        EfCoreRepository<IssueTrackingDbContext, Issue, Guid>,
        IIssueRepository
    {
        public EfCoreIssueRepository(
            IDbContextProvider<IssueTrackingDbContext> dbContextProvider) 
            : base(dbContextProvider)
        {
        }

        public async Task<List<Issue>> GetInActiveIssuesAsync()
        {
            var daysAgo30 = DateTime.Now.Subtract(TimeSpan.FromDays(30));

            return await DbSet.Where(i =>

                //Open
                !i.IsClosed &&

                //Assigned to nobody
                i.AssignedUserId == null &&

                //Created 30+ days ago
                i.CreationTime < daysAgo30 &&

                //No comment or the last comment was 30+ days ago
                (i.LastCommentTime == null || i.LastCommentTime < daysAgo30)

            ).ToListAsync();
        }
    }
}
````

(使用EF Core來實現. 如何使用EF Core實現倉儲,請參見[EF Core整合文件](Entity-Framework-Core.md) )

來看一下`GetInActiveIssuesAsync`的實現,可以看到定義了一個**非活動問題的業務規則**:

- 是*open*的(非*IsClosed* )
- 沒有關聯到任何人
- 建立時間大於30天
- 最近30天沒有評論

這個業務邏輯就被實現在了倉儲內部,當我們需要重用這個業務規則時就會出現問題.

例如:我們需要再實體`Issue`上新增一個方法來判斷是否非活動`bool IsInActive()`,以方便我們在`Issue`例項上獲取.

程式碼如下:

````csharp
public class Issue : AggregateRoot<Guid>, IHasCreationTime
{
    public bool IsClosed { get; private set; }
    public Guid? AssignedUserId { get; private set; }
    public DateTime CreationTime { get; private set; }
    public DateTime? LastCommentTime { get; private set; }
    //...

    public bool IsInActive()
    {
        var daysAgo30 = DateTime.Now.Subtract(TimeSpan.FromDays(30));
        return
            //Open
            !IsClosed &&

            //Assigned to nobody
            AssignedUserId == null &&

            //Created 30+ days ago
            CreationTime < daysAgo30 &&

            //No comment or the last comment was 30+ days ago
            (LastCommentTime == null || LastCommentTime < daysAgo30);
    }
}
````

我們需要複製程式碼來實現,如果將來業務規則傳送變化,我們就必須修改這兩處的程式碼,這樣做非常危險.

這裡有一個很好的解決方案,就是使用*規約模式*.

### 規約模式

[規約](Specifications.md)是一種**強命名**,**可重用**,**可組合**,**可測試**的實體過濾器.

ABP框架提供了基礎設施來輕鬆定義規約類,你可以在程式碼中方便使用.我們來將非活動問題使用規約方式實現:

````csharp
using System;
using System.Linq.Expressions;
using Volo.Abp.Specifications;

namespace IssueTracking.Issues
{
    public class InActiveIssueSpecification : Specification<Issue>
    {
        public override Expression<Func<Issue, bool>> ToExpression()
        {
            var daysAgo30 = DateTime.Now.Subtract(TimeSpan.FromDays(30));
            return i =>

                //Open
                !i.IsClosed &&

                //Assigned to nobody
                i.AssignedUserId == null &&

                //Created 30+ days ago
                i.CreationTime < daysAgo30 &&

                //No comment or the last comment was 30+ days ago
                (i.LastCommentTime == null || i.LastCommentTime < daysAgo30);
        }
    }
}
````

基類`Specification<T>`透過表示式簡化了建立規約的過程,僅需要將倉儲中的表示式遷移至規約中.

現在,我們可以在`Issue` 和 `EfCoreIssueRepository`中重用規約`InActiveIssueSpecification`了.

#### 在實體內使用規約

`Specification` 類提供了一個`IsSatisfiedBy`方法,在例項物件上應用規約檢查,判斷是否滿足規約的要求.程式碼如下:

````csharp
public class Issue : AggregateRoot<Guid>, IHasCreationTime
{
    public bool IsClosed { get; private set; }
    public Guid? AssignedUserId { get; private set; }
    public DateTime CreationTime { get; private set; }
    public DateTime? LastCommentTime { get; private set; }
    //...

    public bool IsInActive()
    {
        return new InActiveIssueSpecification().IsSatisfiedBy(this);
    }
}
````

例項化一個新的規約`InActiveIssueSpecification`例項,並透過`IsSatisfiedBy` 方法進行規約檢查.

#### 在倉儲內使用規約

首先,我們先修改一下倉儲介面:

````csharp
public interface IIssueRepository : IRepository<Issue, Guid>
{
    Task<List<Issue>> GetIssuesAsync(ISpecification<Issue> spec);
}
````

先將`GetInActiveIssuesAsync` 方法改名為`GetIssuesAsync` ,因為我們改為使用規約方式,現在就無需為不同的查詢條件建立不同的介面方法(例如:`GetAssignedIssues(...)`,`GetLockedIssues(...)`)

再修改下倉儲實現:

````csharp
public class EfCoreIssueRepository :
    EfCoreRepository<IssueTrackingDbContext, Issue, Guid>,
    IIssueRepository
{
    public EfCoreIssueRepository(
        IDbContextProvider<IssueTrackingDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task<List<Issue>> GetIssuesAsync(ISpecification<Issue> spec)
    {
        return await DbSet
            .Where(spec.ToExpression())
            .ToListAsync();
    }
}
````

由於`ToExpression()`方法返回一個表示式,因此可以直接將其傳遞給`Where`方法來過濾實體.

我們可以在呼叫`GetIssuesAsync`方法時,傳遞任何規約的例項.

````csharp
public class IssueAppService : ApplicationService, IIssueAppService
{
    private readonly IIssueRepository _issueRepository;

    public IssueAppService(IIssueRepository issueRepository)
    {
        _issueRepository = issueRepository;
    }

    public async Task DoItAsync()
    {
        var issues = await _issueRepository.GetIssuesAsync(
            new InActiveIssueSpecification()
        );
    }
}
````

##### 預設倉儲使用規約

實際上,我們不必非要建立一個自定義倉儲來使用規約方式,泛型倉儲`IRepository`同樣可以使用規約,因為`IRepository`已擴充套件了`IQueryable`物件,因此可以在泛型倉儲上使用,程式碼如下:

````csharp
public class IssueAppService : ApplicationService, IIssueAppService
{
    private readonly IRepository<Issue, Guid> _issueRepository;

    public IssueAppService(IRepository<Issue, Guid> issueRepository)
    {
        _issueRepository = issueRepository;
    }

    public async Task DoItAsync()
    {
        var issues = AsyncExecuter.ToListAsync(
            _issueRepository.Where(new InActiveIssueSpecification())
        );
    }
}
````

`AsyncExecuter`是ABP框架提供的一個非同步LINQ擴充套件方法(與`ToListAsync`類似),這個方法不依賴依賴EF Core,請參見[倉儲文件](Repositories.md).

#### 組合規約

規約強大的能力就是可組合.假設我們還有一個業務規則:`Issue` 僅在里程碑中才返回`true`:

````csharp
public class MilestoneSpecification : Specification<Issue>
{
    public Guid MilestoneId { get; }

    public MilestoneSpecification(Guid milestoneId)
    {
        MilestoneId = milestoneId;
    }

    public override Expression<Func<Issue, bool>> ToExpression()
    {
        return i => i.MilestoneId == MilestoneId;
    }
}
````

此規約與`InActiveIssueSpecification`的區別,它是有引數的.我們可以組合兩種規約來實現獲取指定里程碑下的非活動問題列表

````csharp
public class IssueAppService : ApplicationService, IIssueAppService
{
    private readonly IRepository<Issue, Guid> _issueRepository;

    public IssueAppService(IRepository<Issue, Guid> issueRepository)
    {
        _issueRepository = issueRepository;
    }

    public async Task DoItAsync(Guid milestoneId)
    {
        var issues = AsyncExecuter.ToListAsync(
            _issueRepository
                .Where(
                    new InActiveIssueSpecification()
                        .And(new MilestoneSpecification(milestoneId))
                        .ToExpression()
                )
        );
    }
}
````

上面的示例使用了`And`擴充套件方法來組合規約.還有更多的組合方法,如:`Or(...)`和`AndNot(...)`.

> 有關ABP框架提供的規約更多資訊,請參見[規約文件](Specifications.md).

### 領域服務

領域服務主要來實現本領域的邏輯:

* 依賴**服務和倉儲**.
* 需要使用多個聚合.

領域服務和領域物件一起使用.領域服務可以獲取並返回**實體**,**值物件**等,它們不返回**DTO**.DTO屬於應用層的一部分.

**示例:使用者關聯一個問題**

需要在`Issue`實體中實現問題的關聯:

````csharp
public class Issue : AggregateRoot<Guid>
{
    //...
    public Guid? AssignedUserId { get; private set; }

    public async Task AssignToAsync(AppUser user, IUserIssueService userIssueService)
    {
        var openIssueCount = await userIssueService.GetOpenIssueCountAsync(user.Id);

        if (openIssueCount >= 3)
        {
            throw new BusinessException("IssueTracking:ConcurrentOpenIssueLimit");
        }

        AssignedUserId = user.Id;
    }

    public void CleanAssignment()
    {
        AssignedUserId = null;
    }
}
````

現在我們把邏輯遷移到領域服務中實現.

首先,修改一下 `Issue` 類:

````csharp
public class Issue : AggregateRoot<Guid>
{
    //...
    public Guid? AssignedUserId { get; internal set; }
}
````

* 刪除關聯的相關方法.
* 修改屬性 `AssignedUserId` 的 setter 為 `internal`,以允許領域服務可以修改.

下一步是建立一個名為`IssueManager`的領域服務,此領域服務的`AssignToAsync`方法負責將問題關聯至指定的使用者.

````csharp
public class IssueManager : DomainService
{
    private readonly IRepository<Issue, Guid> _issueRepository;

    public IssueManager(IRepository<Issue, Guid> issueRepository)
    {
        _issueRepository = issueRepository;
    }

    public async Task AssignToAsync(Issue issue, AppUser user)
    {
        var openIssueCount = await _issueRepository.CountAsync(
            i => i.AssignedUserId == user.Id && !i.IsClosed
        );

        if (openIssueCount >= 3)
        {
            throw new BusinessException("IssueTracking:ConcurrentOpenIssueLimit");
        }

        issue.AssignedUserId = user.Id;
    }
}
````

`IssueManager`可以注入其它服務,來查詢指定使用者已經關聯的未解決問題數量.

> 我們建議使用 `Manager` 字尾來命名領域服務.

這種設計的唯一缺陷是可以在類`Issue`外部修改`Issue.AssignedUserId`屬性.但是它的訪問級別是`internal`而非`public`,在`IssueTracking.Domain`專案內部才能被修改,我們認為這樣是合理的:

* 開發人員清楚領域層的開發規則,他們會使用`IssueManager`來執行業務邏輯.
* 應用層開發人員只能使用`IssueManager`,因此他們無法直接修改實體屬性.

儘管兩種方式有各自的優勢,但我們更喜歡建立領域服務並注入其它服務來執行業務邏輯這種方式.

### 應用服務

應用服務是實現**用例**的無狀態服務.應用服務通常**獲取並返回DTO**.應用服務被展現層所使用,應用服務**呼叫領域物件**(實體,倉儲等)來實現用例.

應用服務的通用原則:

* 實現特定用例的**應用程式邏輯**,不要在應用服務內實現核心領域的邏輯.
* 應用服務的方法**不要返回實體**.始終只返回DTO.

**示例:使用者關聯一個問題**

````csharp
using System;
using System.Threading.Tasks;
using IssueTracking.Users;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace IssueTracking.Issues
{
    public class IssueAppService : ApplicationService, IIssueAppService
    {
        private readonly IssueManager _issueManager;
        private readonly IRepository<Issue, Guid> _issueRepository;
        private readonly IRepository<AppUser, Guid> _userRepository;

        public IssueAppService(
            IssueManager issueManager,
            IRepository<Issue, Guid> issueRepository,
            IRepository<AppUser, Guid> userRepository)
        {
            _issueManager = issueManager;
            _issueRepository = issueRepository;
            _userRepository = userRepository;
        }

        [Authorize]
        public async Task AssignAsync(IssueAssignDto input)
        {
            var issue = await _issueRepository.GetAsync(input.IssueId);
            var user = await _userRepository.GetAsync(input.UserId);

            await _issueManager.AssignToAsync(issue, user);

            await _issueRepository.UpdateAsync(issue);
        }
    }
}
````

應用服務的方法通常包含三個步驟:

1. 從資料庫獲取用例所需的領域物件.
2. 使用領域物件(領域服務,實體等)執行業務邏輯.
3. 將實體的變更持久化至資料庫.

> 如果使用的是EF Core,第三步不是必須的,因為EF Core有追蹤實體變化的功能.如果要利用此功能,請參閱上面的"關於資料庫獨立原則的討論"章節.

`IssueAssignDto` 是本示例中一個簡單的DTO物件:

````csharp
using System;

namespace IssueTracking.Issues
{
    public class IssueAssignDto
    {
        public Guid IssueId { get; set; }
        public Guid UserId { get; set; }
    }
}
````

### 資料傳輸物件

[DTO](Data-Transfer-Objects.md)是應用層與展現層間傳輸資料的簡單物件.應用服務方法獲取並返回Dto.

#### DTO通用原則和最佳實踐

* DTO應該是**可被序列化**的.因為大所數情況下,DTO是透過網路傳輸的,因此它應該具有**無參的建構函式**.
* 不應該包含任何**業務邏輯**.
* **切勿**繼承或引用**實體**.

**輸入DTO**(應用服務方法的引數)與 **輸出DTO** (應用服務方法的返回物件)具有不同的作用,因此,它們應該區別對待. 

#### 輸入DTO 最佳實踐

##### 不要在輸入DTO中定義不使用的屬性

**僅**在輸入DTO中定義用例**所需要的屬性**！否則,會造成呼叫應用服務的客戶端產生困惑.

這個規則好像沒什麼必要,因為沒人會在方法引數(輸入DTO)中新增無用的屬性.但是,有時候,特別是在重用DTO時,輸入DTO會包含無用的屬性.

##### 不要重用輸入DTO

**為每個用例**(應用服務的方法)單獨定義一個**專屬的輸入DTO**.否則,在一些情況下,會新增一些不被使用的屬性,這樣就違反上面的規則:不要在輸入DTO中定義不使用的屬性.

在兩個用例中重用相同的DTO似乎很有吸引力,因為它們的屬性是一模一樣的.現階段它們是一樣的,但是隨著業務變化,可能它們會產生差異,屆時你可能還是需要進行拆分.**和用例間的耦合相比,程式碼的複製可能是更好的做法**.

重用輸入DTO的另外一種方式是**繼承**DTO,這同樣會產生上面描述的問題.

**示例:使用者應用服務**

````csharp
public interface IUserAppService : IApplicationService
{
    Task CreateAsync(UserDto input);
    Task UpdateAsync(UserDto input);
    Task ChangePasswordAsync(UserDto input);
}
````

`UserDto`作為`IUserAppService`所有方法的輸入DTO,程式碼如下:

````csharp
public class UserDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public DateTime CreationTime { get; set; }
}
````

對於上面的示例:

* `Id` 屬性在 *Create* 方法中,沒有被使用,因為`Id`由伺服器生成.
* `Password` 屬性在 *Update* 方法中,沒有被使用.因為有修改密碼的單獨方法.
* `CreationTime` 屬性未被使用,因為不允許客戶端傳送建立時間屬性,這個應該由伺服器生成.

較好的做法應該這樣:

````csharp
public interface IUserAppService : IApplicationService
{
    Task CreateAsync(UserCreationDto input);
    Task UpdateAsync(UserUpdateDto input);
    Task ChangePasswordAsync(UserChangePasswordDto input);
}
````

下面是輸入DTO的定義:

````csharp
public class UserCreationDto
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class UserUpdateDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
}

public class UserChangePasswordDto
{
    public Guid Id { get; set; }
    public string Password { get; set; }
}
````

雖然編寫了更多的程式碼,但是這樣可維護性更高.

**例外情況:**該規則有一些例外的情況,例如,你想開發兩個方法,它們共用相同的輸入DTO(透過繼承或重用),有一個報表頁面有多個過濾條件,多個應用服務使用相同的輸入引數返回不同的結果(如,大屏展示資料,Excel報表,csv報表).這種情況下,你是需要修改一個引數,多個應用服務都應該一起被修改.

##### 輸入DTO中驗證邏輯

- 僅在DTO內執行**簡單驗證**.使用資料註解驗證屬性或透過`IValidatableObject` 方式.
- **不要執行領域驗證**.例如,不要在DTO中檢查使用者名稱是否唯一的驗證.

**示例:使用註解方式**

````csharp
using System.ComponentModel.DataAnnotations;

namespace IssueTracking.Users
{
    public class UserCreationDto
    {
        [Required]
        [StringLength(UserConsts.MaxUserNameLength)]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(UserConsts.MaxEmailLength)]
        public string Email { get; set; }

        [Required]
        [StringLength(UserConsts.MaxEmailLength,
        MinimumLength = UserConsts.MinPasswordLength)]
        public string Password { get; set; }
    }
}
````

當輸入無效時,ABP框架會自動驗證輸入DTO,丟擲`AbpValidationException`異常,並向客戶返回`400`的HTTP狀態碼.

> 一些開發人員認為最好將驗證規則和DTO分離.我們認為宣告性(資料註解)方式是比較實用的,不會引起任何設計問題.如果你喜歡其它方式,ABP還支援[FluentValidation繼承](FluentValidation.md).有關所有驗證的詳細文件,請參見[驗證文件](Validation.md).

#### 輸出DTO最佳實踐

* 保持**數量較少**的輸出DTO,儘可能**重用輸出DTO**(例外:不要將輸入DTO作為輸出DTO).
* 輸出DTO可以包含比用例需要的屬性**更多**的屬性.
* 針對 **Create** 和 **Update** 方法,返回實體的DTO.

以上建議的原因是:

* 使客戶端程式碼易於開發和擴充套件:
  * 客戶端處理**相似但不相同**的DTO是有問題的.
  * 將來UI或客戶端通常會使用到DTO上的**其它屬性**.返回實體的所有屬性,可以在無需修改服務端程式碼的情況下,只修改客戶端程式碼.
  * 在開放API給**第三方客戶端**時,避免不同需求的返回不同的DTO.
* 使伺服器端程式碼易於開發和擴充套件:
  * 你需要**維護**的類的數量較少.
  * 你可以重用Entity->DTO**物件對映**的程式碼.
  * 不同的方法返回相同的型別,可以使得在**新增新方法**時變的簡單明瞭.

**示例:不同的方法返回不同的DTO**

````csharp
public interface IUserAppService : IApplicationService
{
    UserDto Get(Guid id);    
    List<UserNameAndEmailDto> GetUserNameAndEmail(Guid id);    
    List<string> GetRoles(Guid id);
    List<UserListDto> GetList();
    UserCreateResultDto Create(UserCreationDto input);
    UserUpdateResultDto Update(UserUpdateDto input);
}
````

> 這裡我們沒有使用非同步方式,是為了示例更清晰,你實際程式碼中應該使用非同步方式)

上面的示例程式碼中,每個方法都返回了不同的DTO型別,這樣處理,會導致查詢資料,對映物件都會有很多重複的程式碼.

應用服務`IUserAppService` 可以簡化成如下程式碼:

````csharp
public interface IUserAppService : IApplicationService
{
    UserDto Get(Guid id);
    List<UserDto> GetList();
    UserDto Create(UserCreationDto input);
    UserDto Update(UserUpdateDto input);
}
````

只需使用一個DTO物件

````csharp
public class UserDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public DateTime CreationTime { get; set; }
    public List<string> Roles { get; set; }
}
````

* 刪除 `GetUserNameAndEmail`和`GetRoles` 方法,因為,返回的DTO中已經包含了對應的資訊.
* `GetList`方法的返回的泛型型別與`Get`方法的返回型別一致.
* `Create` 與 `Update`的返回型別都是 `UserDto`.

如上所述,使用相同的DTO有很多優點.例如,我們在UI上使用**表格**展現使用者集合,再使用者資料更新後,我們可以獲取到返回物件,並對**表格資料來源進行更新**.因此,我們無需再次呼叫`GetList`來獲取全部資料.這就是我們為什麼建議`Create` 與 `Update`方法都返回相同`UserDto`的原因.

##### 討論

輸出DTO的建議並不適用於所有情況.出於**效能**原因,我們可以忽略這些建議,尤其是在返回**大量資料**,為UI定製,**併發量較高**時.

在這些情況下,你可以定製僅包含**必要資訊的DTO**.上面的建議只適用於額外多些屬性並**不會損失太多效能**,並關注程式碼**可維護**的應用系統.

#### 物件對映到物件

當兩個物件具有相同或相似的屬性,自動將[物件對映到物件](Object-To-Object-Mapping.md)是一種將值從一個物件複製到另外一個物件非常有用的方法.

DTO和實體通常具有相同或相似的屬性,你經常需要從一個實體建立一個DTO物件.相較於手動對映,基於[AutoMapper](http://automapper.org/)的ABP[物件對映系統](Object-To-Object-Mapping.md),更加方便簡單.

* **僅**在**實體=>輸出DTO**的時候使用自動對映.
* 不要在**輸入DTO=>Entity**的時候使用自動對映.

因為以下原因,你不應該在輸入DTO=>Entity的時候使用自動對映:

1. 實體類通常具有一個**建構函式**,該建構函式帶有引數,確保建立有效的物件,而自動物件對映通常需要一個無參建構函式.
2. 大多數實體中的屬性setter是**私有的**,你只能呼叫實體上的方法來修改屬性.
3. 另外,需要進行對使用者或客戶端的**輸入引數進行驗證**,而不是盲目對映到實體屬性上.

儘管其中一些問題可以額外配置對映來解決(如,AutoMapper允許自定義對映規則),但這樣會使業務邏輯被**耦合到基礎設施程式碼中**.我們認為業務程式碼應該明確,清晰且易於理解.

有關此部分的建議,請參加下面的"*實體建立*"部分

## 用例

本節將演示一些用例,並討論替代方案

### 實體建立

實體或聚合根的建立,是實體生命週期的開始."*聚合/聚合根規則及最佳實踐*"章節中建議為Entity類定義**一個主建構函式**,以確保建立一個**有效的實體**.因此,需要建立該實體物件例項時,都應該**使用該建構函式**.

 `Issue` 聚合根的程式碼如下:

````csharp
public class Issue : AggregateRoot<Guid>
{
    public Guid RepositoryId { get; private set; }
    public string Title { get; private set; }
    public string Text { get; set; }
    public Guid? AssignedUserId { get; internal set; }

    public Issue(
        Guid id,
        Guid repositoryId,
        string title,
        string text = null
        ) : base(id)
    {
        RepositoryId = repositoryId;
        Title = Check.NotNullOrWhiteSpace(title, nameof(title));
        Text = text; //Allow empty/null
    }
    
    private Issue() { /* Empty constructor is for ORMs */ }

    public void SetTitle(string title)
    {
        Title = Check.NotNullOrWhiteSpace(title, nameof(title));
    }

    //...
}
````

* 透過其非空引數的建構函式建立有效的實體.
* 如需修改 `Title` 屬性,必須透過`SetTitle` 方法,來確保被設定值的有效性.
* 如需將此問題關聯至使用者,則需要使用`IssueManager`(關聯前需要執行一些業務邏輯,相關邏輯參見上面的"*領域服務*"部分)
* `Text` 屬性setter是公開的,因為它可以為null,並且本示例中也沒有驗證規則,它在建構函式中也是可選的.

建立問題的應用服務程式碼:

````csharp
public class IssueAppService : ApplicationService, IIssueAppService
{
    private readonly IssueManager _issueManager;
    private readonly IRepository<Issue, Guid> _issueRepository;
    private readonly IRepository<AppUser, Guid> _userRepository;

    public IssueAppService(
        IssueManager issueManager,
        IRepository<Issue, Guid> issueRepository,
        IRepository<AppUser, Guid> userRepository)
    {
        _issueManager = issueManager;
        _issueRepository = issueRepository;
        _userRepository = userRepository;
    }

    public async Task<IssueDto> CreateAsync(IssueCreationDto input)
    {
        // Create a valid entity
        var issue = new Issue(
            GuidGenerator.Create(),
            input.RepositoryId,
            input.Title,
            input.Text
        );

        // Apply additional domain actions
        if (input.AssignedUserId.HasValue)
        {
            var user = await _userRepository.GetAsync(input.AssignedUserId.Value);
            await _issueManager.AssignToAsync(issue, user);
        }

        // Save
        await _issueRepository.InsertAsync(issue);

        // Return a DTO represents the new Issue
        return ObjectMapper.Map<Issue, IssueDto>(issue);
    }
}
````

`CreateAsync` 方法;

* 使用 `Issue` **建構函式** 建立一個有效的問題.`Id` 屬性透過[IGuidGenerator](Guid-Generation.md)服務生成.此處沒有使用物件自動對映.
* 如果需要將**問題關聯至使用者**,則透過 `IssueManager`來執行關聯邏輯.
* **儲存** 實體至資料庫.
* 最後,使用 `IObjectMapper` 將`Issue`實體**對映**為 `IssueDto` 並返回.

#### 在建立實體時執行領域規則

`Issue`除了在建構函式中進行了一些簡單驗證外,示例中沒其它業務驗證.在有些情況下,在建立實體時會有一些其它業務規則.

假如,已經存在一個完全相同的問題,那麼就不要再建立問題.這個規則應該在哪裡執行?在**應用服務中執行是不對的**,因為它是**核心業務(領域)的規則**,應該將此規則在領域服務中執行.在這種情況下,我們應該在`IssueManager`中執行此規則,因此應該強制應用服務呼叫領域服務`IssueManager`來新建`Issue`.

首先修改 `Issue` 建構函式的訪問級別為 `internal`:

````csharp
public class Issue : AggregateRoot<Guid>
{
    //...

    internal Issue(
        Guid id,
        Guid repositoryId,
        string title,
        string text = null
        ) : base(id)
    {
        RepositoryId = repositoryId;
        Title = Check.NotNullOrWhiteSpace(title, nameof(title));
        Text = text; //Allow empty/null
    }
        
    //...
}
````

這樣可以防止,應用服務直接使用`Issue` 的建構函式去建立`Issue` 例項,必須使用 `IssueManager`來建立.然後我們再新增一個`CreateAsync`方法:

````csharp
using System;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace IssueTracking.Issues
{
    public class IssueManager : DomainService
    {
        private readonly IRepository<Issue, Guid> _issueRepository;

        public IssueManager(IRepository<Issue, Guid> issueRepository)
        {
            _issueRepository = issueRepository;
        }

        public async Task<Issue> CreateAsync(
            Guid repositoryId,
            string title,
            string text = null)
        {
            if (await _issueRepository.AnyAsync(i => i.Title == title))
            {
                throw new BusinessException("IssueTracking:IssueWithSameTitleExists");
            }

            return new Issue(
                GuidGenerator.Create(),
                repositoryId,
                title,
                text
            );
        }
    }
}
````

* `CreateAsync` 方法會檢查標題是否已經存在,當有相同標題的問題時,會丟擲業務異常.
* 如果標題沒有重複的,則建立並返回一個新的 `Issue`物件.

再修改`IssueAppService` 的程式碼,來呼叫 `IssueManager`的 `CreateAsync` 方法:

````csharp
public class IssueAppService : ApplicationService, IIssueAppService
{
    private readonly IssueManager _issueManager;
    private readonly IRepository<Issue, Guid> _issueRepository;
    private readonly IRepository<AppUser, Guid> _userRepository;

    public IssueAppService(
        IssueManager issueManager,
        IRepository<Issue, Guid> issueRepository,
        IRepository<AppUser, Guid> userRepository)
    {
        _issueManager = issueManager;
        _issueRepository = issueRepository;
        _userRepository = userRepository;
    }

    public async Task<IssueDto> CreateAsync(IssueCreationDto input)
    {
        // Create a valid entity using the IssueManager
        var issue = await _issueManager.CreateAsync(
            input.RepositoryId,
            input.Title,
            input.Text
        );

        // Apply additional domain actions
        if (input.AssignedUserId.HasValue)
        {
            var user = await _userRepository.GetAsync(input.AssignedUserId.Value);
            await _issueManager.AssignToAsync(issue, user);
        }

        // Save
        await _issueRepository.InsertAsync(issue);

        // Return a DTO represents the new Issue
        return ObjectMapper.Map<Issue, IssueDto>(issue);
    }    
}

// *** IssueCreationDto class ***
public class IssueCreationDto
{
    public Guid RepositoryId { get; set; }
    [Required]
    public string Title { get; set; }
    public Guid? AssignedUserId { get; set; }
    public string Text { get; set; }
}
````

##### 討論:為什麼`IssueManager`中沒有執行`Issue`的儲存?

你可能會問"**為什麼`IssueManager`中沒有執行`Issue`的儲存?**".我們認為這是應用服務的職責.

因為,應用服務可能在儲存`Issue`物件之前,需要對其它物件進行修改.如果領域服務執行了儲存,那麼*儲存*操作就是重複的.

* 會觸發兩次資料庫會互動,這會導致效能損失.
* 需要額外新增顯式的事務來包含這兩個操作,才能保證資料一致性.
* 如果因為業務規則取消了實體的建立,則應該在資料庫事務中回滾事務,取消所有操作.

假如在`IssueManager.CreateAsync`中先儲存一次資料,那麼資料會先執行一次*Insert*操作,後面關聯使用者的邏輯執行後,又會再執行一次*Update*操作.

如果不在`IssueManager.CreateAsync`中儲存資料,那麼,新建`Issue`和關聯使用者,只會執行一次*Insert*操作.

##### 討論:為什麼沒有在應用服務中執行標題是否重複的檢查?

簡單地說"因為它是**核心領域邏輯**,應該在領域層實現".這又帶來一個新問題,"**如何確定**是領域層邏輯,還是應用層邏輯"?(這個我們後面再詳細討論)

對於此示例,可以用一個簡單的問題來判斷到底是領域邏輯還是應用邏輯:"如果還有另外一種建立`Issue`的方式(用例),我們是否還需要執行?如果需要執行,就屬於領域層邏輯,不需要執行就是應用層邏輯".你可能認為為什麼還有別的用例來建立`Issue`呢?

* 應用程式的**終端使用者**可能會在UI上建立`Issue`.
* 系統內部人員,可以在**後臺管理**端採用另外一種方式建立`Issue`(這種情況下,可能使用不同的業務規則).
* 對**第三方客戶端**開放的API,它們的規則又有所不同.
* 還有**後臺作業系統**會執行某些操作時建立`Issue`,這樣,它是在沒有任何使用者互動情況下建立`Issue`.
* 還有可能是UI上某個按鈕,可以將某些內容(例如,討論)轉為`Issue`.

我們還可以舉更多例子.所有這些都應該透過**不同的應用服務方法來實現**(請參見下面的"*多個應用服務層*"部分),但是它們**始終遵循**以下的規則:

新的問題標題不能與任何已有的問題標題相同.這就是為什麼說的"*標題是否重複的檢查*"屬於核心領域邏輯的原因,這個邏輯應該在領域層,而**不應該**在應用層的所有方法中**去重複**定義.

### 修改實體

建立實體後,將根據用例對實體進行修改,直到將其從系統中刪除.可以有不同的用例直接或間接的修改實體.

在本節中,我們將討論一種典型的修改操作,該操作會修改`Issue`的多個屬性.

從*Update* DTO開始:

````csharp
public class UpdateIssueDto
{
    [Required]
    public string Title { get; set; }
    public string Text { get; set; }
    public Guid? AssignedUserId { get; set; }
}
````

對比`IssueCreationDto`,可以發現,缺少了`RepositoryId`屬性,因為我們不允許跨倉庫移動`Issue`.僅`Title`屬性是必填的.

`IssueAppService`中*Update*的實現如下::

````csharp
public class IssueAppService : ApplicationService, IIssueAppService
{
    private readonly IssueManager _issueManager;
    private readonly IRepository<Issue, Guid> _issueRepository;
    private readonly IRepository<AppUser, Guid> _userRepository;

    public IssueAppService(
        IssueManager issueManager,
        IRepository<Issue, Guid> issueRepository,
        IRepository<AppUser, Guid> userRepository)
    {
        _issueManager = issueManager;
        _issueRepository = issueRepository;
        _userRepository = userRepository;
    }

    public async Task<IssueDto> UpdateAsync(Guid id, UpdateIssueDto input)
    {
        // Get entity from database
        var issue = await _issueRepository.GetAsync(id);

        // Change Title
        await _issueManager.ChangeTitleAsync(issue, input.Title);

        // Change Assigned User
        if (input.AssignedUserId.HasValue)
        {
            var user = await _userRepository.GetAsync(input.AssignedUserId.Value);
            await _issueManager.AssignToAsync(issue, user);
        }

        // Change Text (no business rule, all values accepted)
        issue.Text = input.Text;

        // Update entity in the database
        await _issueRepository.UpdateAsync(issue);

        // Return a DTO represents the new Issue
        return ObjectMapper.Map<Issue, IssueDto>(issue);
    }
}
````

* `UpdateAsync` 方法引數 `id`被作為獨立引數,放置在`UpdateIssueDto`之外.這是一項設計決策,當你將此應用服務[自動匯出](API/Auto-API-Controllers.md)為HTTP API時,API端點時幫助ABP正確定義HTTP路由,這與DDD無關.
* 首先從資料庫中**獲取** `Issue` 實體.
* 透過 `IssueManager`的 `ChangeTitleAsync`方法修改標題,而非直接透過 `Issue.SetTitle(...)`直接修改.因為我們需要像建立時那樣,**執行標題的重複檢查邏輯**.這需要對`Issue`類和`IssueManager`類進行一些調整(將在下面說明).
* 透過 `IssueManager`的 `AssignToAsync` 方法來**關聯使用者**.
* 直接設定 `Issue.Text`屬性,因為它本身沒有任何業務邏輯需要執行.如果以後需要可以再進行重構.
* **儲存修改**至資料庫.同樣,儲存修改後的實體屬於應用服務的職責,它可以協調業務物件和事務.如果在`IssueManager`內部的 `ChangeTitleAsync` 和 `AssignToAsync` 方法中進行儲存,則會導致兩次資料庫操作(請參見上面的*討論:為什麼`IssueManager`中沒有執行`Issue`的儲存?*) 
* 最後,使用 `IObjectMapper` 將`Issue`實體**對映**為 `IssueDto` 並返回.

如前所述,我們需要對`Issue`類和`IssueManager`類進行一些調整:

首先,修改 `SetTitle`方法的訪問級別為internal:

````csharp
internal void SetTitle(string title)
{
    Title = Check.NotNullOrWhiteSpace(title, nameof(title));
}
````

再在`IssueManager`中新增一個新方法來修改標題:

````csharp
public async Task ChangeTitleAsync(Issue issue, string title)
{
    if (issue.Title == title)
    {
        return;
    }

    if (await _issueRepository.AnyAsync(i => i.Title == title))
    {
        throw new BusinessException("IssueTracking:IssueWithSameTitleExists");
    }

    issue.SetTitle(title);
}
````

## 領域邏輯和應用邏輯

如前所述,領域驅動設計中的*業務邏輯*分為兩部分(各層):領域邏輯和應用邏輯

![domain-driven-design-domain-vs-application-logic](images/domain-driven-design-domain-vs-application-logic.png)

領域邏輯是系統的*核心領域規則*組成,而應用邏輯則滿足特定的*用例*.

雖然定義很明確,但是實施起來卻並不容易.你可能無法確定哪些程式碼應該屬於領域層,哪些程式碼應該屬於應用層,本節會嘗試解釋差異.

### 多應用層

當你的系統很大時,DDD有助於**處理複雜問題**.尤其是,**單個領域**需要多個**應用程式執行**,那麼**領域邏輯與應用邏輯分離**就變的非常重要.

假設你正在構建一個具有多個應用程式的系統:

* 一個**公開的應用網站**,使用ASP.NET Core MVC構建,展示商品給來訪者.這樣的網站不需要身份驗證即可檢視商品.來訪者只有執行了某些操作(例如,將商品新增到購物車)後,才需要登入網站.
* 一個**後臺管理系統**,UI使用Angular,透過REST API請求資料.內部員工使用這個系統來維護資料(例如,編輯商品說明).
* 一個**移動端應用程式**,它比公開的網站UI上更加簡潔.它透過REST API或其它技術(例如,TCP sockets)請求資料.

![domain-driven-design-multiple-applications](images/domain-driven-design-multiple-applications.png)

每個應用程式都有不同的**需求**,不同的**用例**(應用服務方法),不同的DTO,不同的**驗證**和**授權**規則等.

將所有這些邏輯都集中到一個應用層中,會使你的服務包含太多的`if`條件分支及**複雜的業務邏輯**,從而使你的程式碼開發,**維護**,測試,引發各種問題.

如果你在一個領域中有多個應用程式

- 為每種應用程式或客戶端建立獨立的應用層,並在這些單獨層中執行特定於應用業務邏輯.
- 使用共享的核心領域邏輯

為了實現這樣的設計,首先我們需要區分領域邏輯和應用邏輯.

為了更清楚的實現,你可以為不同的應用型別建立不同的專案(`.csproj`):

* `IssueTracker.Admin.Application` 和 `IssueTracker.Admin.Application.Contracts` 為後臺管理系統提供服務.
* `IssueTracker.Public.Application` 和 `IssueTracker.Public.Application.Contracts` 為公開網站提供服務.
* `IssueTracker.Mobile.Application` 和 `IssueTracker.Mobile.Application.Contracts` 為移動端應用提供服務.

### 示例

本節包含一些應用服務及領域服務的示例,討論業務邏輯應該放置在哪一層

**示例:在領域服務中建立`Organization`**

````csharp
public class OrganizationManager : DomainService
{
    private readonly IRepository<Organization> _organizationRepository;
    private readonly ICurrentUser _currentUser;
    private readonly IAuthorizationService _authorizationService;
    private readonly IEmailSender _emailSender;

    public OrganizationManager(
        IRepository<Organization> organizationRepository, 
        ICurrentUser currentUser, 
        IAuthorizationService authorizationService, 
        IEmailSender emailSender)
    {
        _organizationRepository = organizationRepository;
        _currentUser = currentUser;
        _authorizationService = authorizationService;
        _emailSender = emailSender;
    }

    public async Task<Organization> CreateAsync(string name)
    {
        if (await _organizationRepository.AnyAsync(x => x.Name == name))
        {
            throw new BusinessException("IssueTracking:DuplicateOrganizationName");
        }

        await _authorizationService.CheckAsync("OrganizationCreationPermission");

        Logger.LogDebug($"Creating organization {name} by {_currentUser.UserName}");

        var organization = new Organization();

        await _emailSender.SendAsync(
            "systemadmin@issuetracking.com",
            "New Organization",
            "A new organization created with name: " + name
        );

        return organization;
    }
}
````

我們來逐個檢查`CreateAsync`方法中的程式碼,討論是否應該在領域服務中

* **正確**:首先檢查有**無重複的組織名稱**,並丟擲異常.這與核心領域規則有關,因為我們絕對不允許重複的名稱.
* **錯誤**:領域服務不應該執行**授權檢查**,[授權](Authorization.md)應該在應用層處理. 
* **錯誤**:它記錄了日誌,包括[當前使用者](CurrentUser.md)的`UserName`.領域服務不應該依賴當前使用者,即便系統中沒有使用者,領域服務也應可用.當前使用者應該是與展現層或應用層有關的概念.
* **錯誤**:它傳送了有關新組織被建立的[郵件](Emailing.md),我們認為這也是特定用例的業務邏輯,你可能像在不同的用例中建立不同的郵件,又或者某些情況無需傳送郵件.

**示例:應用服務中建立`Organization`**

````csharp
public class OrganizationAppService : ApplicationService
{
    private readonly OrganizationManager _organizationManager;
    private readonly IPaymentService _paymentService;
    private readonly IEmailSender _emailSender;

    public OrganizationAppService(
        OrganizationManager organizationManager,
        IPaymentService paymentService, 
        IEmailSender emailSender)
    {
        _organizationManager = organizationManager;
        _paymentService = paymentService;
        _emailSender = emailSender;
    }

    [UnitOfWork]
    [Authorize("OrganizationCreationPermission")]
    public async Task<Organization> CreateAsync(CreateOrganizationDto input)
    {
        await _paymentService.ChargeAsync(
            CurrentUser.Id,
            GetOrganizationPrice()
        );

        var organization = await _organizationManager.CreateAsync(input.Name);
        
        await _organizationManager.InsertAsync(organization);

        await _emailSender.SendAsync(
            "systemadmin@issuetracking.com",
            "New Organization",
            "A new organization created with name: " + input.Name
        );

        return organization; // !!!
    }

    private double GetOrganizationPrice()
    {
        return 42; //Gets from somewhere else...
    }
}
````

我們來逐個檢查`CreateAsync`方法中的程式碼,討論是否應該在應用服務中

* **正確**:應用服務的方法應該是一個工作單元(事務).ABP的[工作單元](Unit-Of-Work.md)系統可以使得此工作自動進行(甚至無需`[UnitOfWork]`註解).
* **正確**: [授權](Authorization.md)應該在應用層處理.這裡透過使用`[Authorize]`來完成.
* **正確**:呼叫付款(基礎設施服務)為此操作收取費用(建立組織是我們業務中的付費服務).
* **正確**:應用服務負責將變更的資料儲存到資料庫.
* **正確**:我們可以將[郵件](Emailing.md)作為通知傳送給管理員.
* **錯誤**:請勿從應用服務中返回實體,應該返回DTO.

**討論:為什麼不將支付邏輯移到領域服務中?**

你可能想知道為什麼付款邏輯程式碼不在`OrganizationManager`中.付款是非常**重要的事情**,我們不能**遺漏任何一次付款**.

它確實非常重要,但是,它不能放到領域服務中.我們可能還有**其它用例**來建立組織但不收取任何費用.例如:

* 管理員可以在後臺管理系統建立新組織,而無需支付任何費用.
* 後臺作業系統匯入,整合,同步組織而無需支付費用.

如你所見,**付款不是建立有效組織的必要操作**.它是特定的應用服務邏輯.

**示例:CRUD操作**

````csharp
public class IssueAppService
{
    private readonly IssueManager _issueManager;

    public IssueAppService(IssueManager issueManager)
    {
        _issueManager = issueManager;
    }

    public async Task<IssueDto> GetAsync(Guid id)
    {
        return await _issueManager.GetAsync(id);
    }

    public async Task CreateAsync(IssueCreationDto input)
    {
        await _issueManager.CreateAsync(input);
    }

    public async Task UpdateAsync(UpdateIssueDto input)
    {
        await _issueManager.UpdateAsync(input);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _issueManager.DeleteAsync(id);
    }
}
````

該應用服務本身**不執行任何操作**,並將所有**操作轉發給** *領域服務*.它甚至將DTO傳遞給`IssueManager`

* 如果沒有**任何業務邏輯**,只有簡單的**CRUD**操作,**請勿**建立領域服務.
* **切勿**將**DTO**傳遞給領域服務,或從領域服務返回**DTO**.

可以在應用服務中直接注入倉儲,實現查詢,建立,更新及刪除操作.除非在這些操作過程中需要執行某些業務邏輯,在這種情況下,請建立領域服務.

> 不要建立"將來可能需要"這種CRUD領域服務方法([YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)),在需要時重構它並重構現有程式碼. 由於應用層優雅地抽象了領域層,因此重構過程不會影響UI層和其他客戶端.

## 相關書籍

如果你對領域驅動設計和構建大型系統有興趣,建議將以下書籍作為參考書籍:

* "*Domain Driven Design*" by Eric Evans
* "*Implementing Domain Driven Design*" by Vaughn Vernon
* "*Clean Architecture*" by Robert C. Martin
