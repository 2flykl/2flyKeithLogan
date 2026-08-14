#include "BoomerangActor.h"
#include "BoomerangComponent.h"
#include "CatchComponent.h"
#include "Components/StaticMeshComponent.h"
#include "UObject/ConstructorHelpers.h"

ABoomerangActor::ABoomerangActor()
{
    PrimaryActorTick.bCanEverTick = true;

    // Create mesh component
    MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MeshComp"));
    RootComponent = MeshComp;
    // Assign a placeholder static mesh (will be set in editor)
    static ConstructorHelpers::FObjectFinder<UStaticMesh> MeshObj(TEXT("/Game/Boomerang/SM_Boomerang.SM_Boomerang"));
    if (MeshObj.Succeeded())
    {
        MeshComp->SetStaticMesh(MeshObj.Object);
    }

    // Create boomerang logic component
    BoomerangComp = CreateDefaultSubobject<UBoomerangComponent>(TEXT("BoomerangComp"));
    BoomerangComp->SetupAttachment(RootComponent);
    BoomerangComp->OnReturnStarted.AddUObject(this, &ABoomerangActor::OnReturnStarted);

    // Create catch component
    CatchComp = CreateDefaultSubobject<UCatchComponent>(TEXT("CatchComp"));
    CatchComp->SetupAttachment(RootComponent);
    CatchComp->OnCatchResult.AddUObject(this, &ABoomerangActor::OnCatchResult);
}

void ABoomerangActor::BeginPlay()
{
    Super::BeginPlay();
    // Initialize components if needed
    if (BoomerangComp)
    {
        BoomerangComp->InitializeComponent();
    }
    if (CatchComp)
    {
        CatchComp->InitializeComponent();
    }
}

void ABoomerangActor::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    // Components handle their own ticking
}

void ABoomerangActor::OnReturnStarted()
{
    UE_LOG(LogTemp, Log, TEXT("Boomerang return phase started"));
}

void ABoomerangActor::OnCatchResult(int32 Grade)
{
    UE_LOG(LogTemp, Log, TEXT("Boomerang caught with grade %d"), Grade);
    // TODO: notify UI / flow system
}
