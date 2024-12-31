class ApiRateLimiter {
  private attempts = 0;
  private blockedUntil: number | null = null;
  private readonly MAX_ATTEMPTS: number = 3;
  private readonly BLOCK_DURATION: number = 5 * 60 * 1000; // 5 minutos

  async executeWithRateLimit(apiCall: () => Promise<any>): Promise<any> {
    if (this.isBlocked()) {
      const remainingTime = this.getRemainingBlockTime();
      throw new Error(`Demasiados intentos. Por favor, espere ${Math.ceil(remainingTime / 1000)} segundos.`);
    }

    try {
      this.attempts++;
      if (this.attempts >= this.MAX_ATTEMPTS) {
        this.block();
      }
      return await apiCall();
    } catch (error) {
      throw error;
    }
  }

  private isBlocked(): boolean {
    if (!this.blockedUntil) return false;
    return Date.now() < this.blockedUntil;
  }

  private block(): void {
    this.blockedUntil = Date.now() + this.BLOCK_DURATION;
  }

  private getRemainingBlockTime(): number {
    if (!this.blockedUntil) return 0;
    return Math.max(0, this.blockedUntil - Date.now());
  }

  reset(): void {
    if (this.blockedUntil && Date.now() >= this.blockedUntil) {
      this.attempts = 0;
      this.blockedUntil = null;
    }
  }
}

export default ApiRateLimiter;
