#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BoomerangActor.generated.h"

class UStaticMeshComponent;
class UBoomerangComponent;
class UCatchComponent;

UCLASS()
class IWA_REBORN_API ABoomerangActor : public AActor
{
    GENERATED_BODY()

public:
    ABoomerangActor();

    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

    /** Static mesh representing the boomerang */
    UPROPERTY(VisibleAnywhere, Category = "Boomerang")
    UStaticMeshComponent* MeshComp;

    /** Component handling launch, flight curve and return logic */
    UPROPERTY(VisibleAnywhere, Category = "Boomerang")
    UBoomerangComponent* BoomerangComp;

    /** Component responsible for catch grading */
    UPROPERTY(VisibleAnywhere, Category = "Boomerang")
    UCatchComponent* CatchComp;

    /** Called by BoomerangComp when the return phase starts */
    UFUNCTION()
    void OnReturnStarted();

    /** Called by CatchComp when a catch attempt is made */
    UFUNCTION()
    void OnCatchResult(int32 Grade);
};
