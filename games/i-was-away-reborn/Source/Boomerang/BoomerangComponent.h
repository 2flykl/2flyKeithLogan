#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "BoomerangComponent.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE(FReturnStartedDelegate);

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class IWA_REBORN_API UBoomerangComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UBoomerangComponent();

    virtual void BeginPlay() override;
    virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

    /** Initialize launch parameters */
    UFUNCTION(BlueprintCallable, Category="Boomerang")
    void LaunchBoomerang(float AimAngle, float Power, float Spin, float CurveBias);

    /** Called when the boomerang enters the return phase */
    UPROPERTY(BlueprintAssignable, Category="Boomerang")
    FReturnStartedDelegate OnReturnStarted;

private:
    /** Current phase: 0=Idle,1=Launch,2=Flight,3=Return */
    int32 Phase;

    float CurrentTime;
    float FlightDuration;

    FVector LaunchStartPos;
    FVector ReturnStartPos;

    /** Settings asset providing tunable parameters */
    UPROPERTY(EditAnywhere, Category="Boomerang")
    class UBoomerangSettings* Settings;

    /** Helper to calculate the spline point at normalized time t (0..1) */
    FVector EvaluateLaunchSpline(float t) const;
    FVector EvaluateReturnSpline(float t) const;
};
